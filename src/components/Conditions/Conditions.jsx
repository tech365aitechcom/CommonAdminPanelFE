import { useState, useEffect, useRef } from 'react'
import { BeatLoader } from 'react-spinners'
import { IoClose } from 'react-icons/io5'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import AdminNavbar from '../Admin_Navbar'
import SideMenu from '../SideMenu'
import { MdEdit, MdDeleteForever } from 'react-icons/md'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

const GROUPS = [
  'warrenty',
  'core',
  'display',
  'functionalMajor',
  'functionalMinor',
  'cosmetics',
  'functional',
  'accessories',
]

// Explicit overrides for names whose camelCase doesn't match the schema key
const GROUP_NAME_OVERRIDES = {
  warranty: 'warrenty',
}

// Converts a group name like "Functional Major" → "functionalMajor"
// then applies any explicit overrides (e.g. "Warranty" → "warrenty")
const resolveGroupKey = (name) => {
  if (!name) return null
  const words = name.trim().split(/\s+/)
  const camel = words
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join('')
  return GROUP_NAME_OVERRIDES[camel] ?? camel
}

const EMPTY_FORM = () =>
  Object.fromEntries(
    GROUPS.flatMap((g) => [
      [`${g}Code`, ''],
      [`${g}Condition`, ''],
    ]),
  )

const downloadSheet = (apiData, downloadType) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

  const columns = [
    'deviceType',
    ...GROUPS.flatMap((g) => [`${g}Code`, `${g}Condition`]),
    'grade',
  ]

  const formattedData =
    downloadType === 'sample'
      ? [Object.fromEntries(columns.map((k) => [k, '']))]
      : apiData.map((item) => {
          const row = Object.fromEntries(columns.map((k) => [k, item[k] || '']))
          if (downloadType === 'updateSheet') row.id = item._id
          return row
        })

  const ws = XLSX.utils.json_to_sheet(formattedData)
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const dataBlob = new Blob([excelBuffer], { type: fileType })
  saveAs(dataBlob, `ConditionSheet_${downloadType}.xlsx`)
}

const Conditions = () => {
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [uploadMode, setUploadMode] = useState(0)
  const [loading, setLoading] = useState(false)
  const [conditions, setConditions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [categories, setCategories] = useState([])
  const { category } = useParams()
  const [sideMenu, setsideMenu] = useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const LIMIT = 20
  const userToken = sessionStorage.getItem('authToken')
  const [activeDB, setActiveDB] = useState(
    sessionStorage.getItem('activeDB') || '',
  )

  const [form, setForm] = useState({
    id: '',
    grade: '',
    deviceType: category,
    ...EMPTY_FORM(),
  })
  const [groups, setGroups] = useState([])

  const updateActiveDb = (newActiveDB) => setActiveDB(newActiveDB)

  useEffect(() => {
    setPage(0)
    getCategories()
    fetchGroups()
  }, [activeDB])

  useEffect(() => {
    setPage(0)
  }, [category])

  useEffect(() => {
    fetchConditions()
  }, [page, category, activeDB])

  const fetchConditions = () => {
    setIsLoading(true)
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/getAll?deviceType=${category}&page=${page}&limit=${LIMIT}`,
        { headers: { Authorization: `${userToken}`, activeDB } },
      )
      .then((res) => {
        setConditions(res?.data?.data || [])
        setTotal(res?.data?.total || 0)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/group/getGroups`,
        { headers: { Authorization: userToken, activeDB } },
      )
      setGroups(res.data.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch groups')
    }
  }

  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/getAll`,
        { headers: { Authorization: userToken, activeDB } },
      )
      setCategories(data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleFileChange = (e) => setFile(e.target.files[0])

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.')
      return
    }
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const endpoint =
        uploadMode === 1
          ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/bulkAdd`
          : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/bulkUpdate`
      await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${userToken}`,
          activeDB,
        },
      })
      fetchConditions()
      alert('File uploaded successfully.')
    } catch (err) {
      console.error('Error uploading file:', err)
      alert('Failed to upload file.')
    } finally {
      setUploadMode(0)
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    setIsLoading(true)
    const payload = { ...form }
    if (!isEditing) delete payload.id

    const endpoint = isEditing
      ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/update`
      : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/create`

    axios
      .post(endpoint, payload, {
        headers: { Authorization: `${userToken}`, activeDB },
      })
      .then(() => {
        if (!isEditing) setPage(0)
        else fetchConditions()
        resetForm()
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to save condition.')
        setIsLoading(false)
      })
  }

  const handleDelete = (conditionId) => {
    setIsLoading(true)
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/conditions/delete`,
        { conditionId },
        { headers: { Authorization: `${userToken}`, activeDB } },
      )
      .then(() => {
        fetchConditions()
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }

  const openEditPopup = (condition) => {
    const fields = {}
    groups.forEach((group) => {
      const g = resolveGroupKey(group.name)
      fields[`${g}Code`] = condition[`${g}Code`] || ''
      fields[`${g}Condition`] = condition[`${g}Condition`] || ''
    })
    setForm({
      id: condition._id,
      grade: condition.grade || '',
      deviceType: condition.deviceType || category,
      ...fields,
    })
    setIsEditing(true)
    setIsPopupOpen(true)
  }

  const resetForm = () => {
    setForm({ id: '', grade: '', deviceType: category, ...EMPTY_FORM() })
    setIsEditing(false)
    setIsPopupOpen(false)
  }

  const columns = [
    'grade',
    ...groups.flatMap((group) => {
      const g = resolveGroupKey(group.name)
      return [`${g}Code`, `${g}Condition`]
    }),
  ]

  const columnLabel = (key) => {
    for (const group of groups) {
      const g = resolveGroupKey(group.name)
      if (key === `${g}Code`) return `${group.name} Code`
      if (key === `${g}Condition`) return `${group.name} Condition`
    }
    return key.charAt(0).toUpperCase() + key.slice(1)
  }

  return (
    <div>
      <div className='navbar'>
        <AdminNavbar
          setsideMenu={setsideMenu}
          sideMenu={sideMenu}
          onActiveDbChange={updateActiveDb}
        />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>

      {isLoading && (
        <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50'>
          <BeatLoader
            color='var(--primary-color)'
            loading={isLoading}
            size={15}
          />
        </div>
      )}

      <div className='flex flex-col items-center py-8 justify-start bg-slate-100 min-h-screen'>
        <div className='flex flex-col w-full container'>
          <div className='relative mb-6 flex flex-col gap-2 border-b-2 pb-2'>
            <p className='text-4xl font-bold text-gray-800'>
              Manage Conditions -{' '}
              <span className='text-primary'>
                {categories.find((item) => item.categoryCode === category)
                  ?.categoryName || 'Category not found'}
              </span>
            </p>
          </div>

          <div className='flex gap-4 mb-8 items-center'>
            <button
              onClick={() => setIsPopupOpen(true)}
              className='font-medium text-sm text-white p-3 rounded bg-primary'
            >
              Add New Condition
            </button>
            <button
              onClick={() => downloadSheet(conditions, 'BulkSheet')}
              className='font-medium text-sm text-white p-3 rounded bg-primary'
            >
              Bulk Download
            </button>
            <button
              onClick={() => setUploadMode(1)}
              className='font-medium text-sm text-white p-3 rounded bg-primary'
            >
              Bulk Upload
            </button>
            <button
              onClick={() => setUploadMode(2)}
              className='font-medium text-sm text-white p-3 rounded bg-primary'
            >
              Bulk Update
            </button>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border-collapse border border-gray-300 rounded-lg shadow-lg'>
              <thead>
                <tr>
                  <th className='px-6 py-3 border'>Actions</th>
                  {columns.map((key) => (
                    <th
                      key={key}
                      className='px-6 py-3 border whitespace-nowrap'
                    >
                      {columnLabel(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {conditions.map((row) => (
                  <tr key={row._id} className='border-b hover:bg-gray-50'>
                    <td className='px-6 py-3 border flex gap-4'>
                      <button
                        onClick={() => openEditPopup(row)}
                        className='text-primary'
                      >
                        <MdEdit size={24} />
                      </button>
                      <button
                        onClick={() => handleDelete(row._id)}
                        className='text-primary'
                      >
                        <MdDeleteForever size={24} />
                      </button>
                    </td>
                    {columns.map((key) => (
                      <td
                        key={key}
                        className='px-6 py-3 border text-sm text-gray-600 whitespace-nowrap'
                      >
                        {row[key] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div className='flex items-center justify-between mt-4'>
              <p className='text-sm text-gray-500'>
                Showing {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} of {total}
              </p>
              <div className='flex items-center gap-1'>
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className='px-2 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100'
                >
                  «
                </button>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className='px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100'
                >
                  Prev
                </button>
                {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => i)
                  .filter((i) => Math.abs(i - page) <= 2)
                  .map((i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`px-3 py-1 text-sm rounded border ${
                        i === page
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(page + 1) * LIMIT >= total}
                  className='px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100'
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(Math.ceil(total / LIMIT) - 1)}
                  disabled={(page + 1) * LIMIT >= total}
                  className='px-2 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100'
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Upload/Update Modal */}
      {uploadMode > 0 && (
        <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg relative w-[400px]'>
            <IoClose
              size={24}
              className='absolute top-3 right-3 text-primary cursor-pointer'
              onClick={() => setUploadMode(0)}
            />
            <h3 className='text-xl font-bold text-center mb-4 mt-2'>
              {uploadMode === 1 ? 'Bulk Upload' : 'Bulk Update'}
            </h3>
            <p className='text-sm text-center'>
              {uploadMode === 1
                ? 'Download sample sheet, fill details and upload.'
                : 'Download update sheet, edit without changing IDs, then upload.'}
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              className='flex flex-row justify-center mt-4 p-3 font-medium text-sm rounded bg-primary text-white cursor-pointer'
            >
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                onChange={handleFileChange}
              />
              {file ? file.name : 'Choose Excel Sheet'}
            </div>
            <div className='flex flex-row w-full items-center justify-between mt-4 mb-4'>
              {uploadMode === 1 ? (
                <button
                  onClick={() => downloadSheet([], 'sample')}
                  className='font-medium text-sm text-white py-3 px-8 rounded bg-primary'
                >
                  Sample Sheet
                </button>
              ) : (
                <button
                  onClick={() => downloadSheet(conditions, 'updateSheet')}
                  className='font-medium text-sm text-white py-3 px-8 rounded bg-primary'
                >
                  Update Sheet
                </button>
              )}
              <button
                onClick={handleUpload}
                disabled={loading}
                className='font-medium text-sm text-white py-3 px-8 rounded bg-primary'
              >
                {loading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isPopupOpen && (
        <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen bg-black bg-opacity-50'>
          <div className='bg-white p-8 rounded-xl shadow-lg relative w-full max-w-4xl'>
            <IoClose
              size={24}
              className='absolute top-4 right-4 text-primary cursor-pointer hover:text-red-500 transition-all'
              onClick={resetForm}
            />
            <h3 className='text-2xl font-bold text-gray-800 mb-6'>
              {isEditing ? 'Edit Condition' : 'Add New Condition'}
            </h3>

            <div className='max-h-[60vh] overflow-y-auto mb-6 pr-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {groups.map((group) => {
                  const g = resolveGroupKey(group.name)
                  const selectedCode = form[`${g}Code`] || ''
                  const selectedCondition = form[`${g}Condition`] || ''
                  return (
                    <div
                      key={g}
                      className='border border-gray-200 rounded-2xl shadow-sm p-6 bg-white space-y-4'
                    >
                      <h4 className='text-xl font-semibold text-gray-800 border-b pb-2 capitalize'>
                        {group.name}
                      </h4>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Select Code
                        </label>
                        <select
                          className='w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-sm'
                          value={selectedCode}
                          onChange={(e) => {
                            const picked = group.codes.find(
                              (c) => c.code === e.target.value,
                            )
                            setForm((prev) => ({
                              ...prev,
                              [`${g}Code`]: e.target.value,
                              [`${g}Condition`]: picked?.description || '',
                            }))
                          }}
                        >
                          <option value=''>-- Select Code --</option>
                          {(group.codes || []).map((code) => (
                            <option key={code._id} value={code.code}>
                              {code.code}
                            </option>
                          ))}
                        </select>
                      </div>
                      {selectedCondition && (
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Condition
                          </label>
                          <input
                            readOnly
                            className='w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg px-4 py-2 text-sm cursor-not-allowed'
                            value={selectedCondition}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className='border border-gray-200 rounded-2xl shadow-sm p-6 bg-white space-y-4 sm:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Grade
                  </label>
                  <input
                    type='text'
                    className='w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-sm'
                    value={form.grade}
                    placeholder='Enter grade'
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, grade: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className='w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all mt-6'
            >
              {isEditing ? 'Update Condition' : 'Submit Condition'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Conditions
