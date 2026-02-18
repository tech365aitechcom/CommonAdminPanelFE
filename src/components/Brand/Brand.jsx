import React, { useState, useEffect, useRef } from 'react'
import { BeatLoader } from 'react-spinners'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import AdminNavbar from '../Admin_Navbar'
import SideMenu from '../SideMenu'

import { IoMdSettings } from 'react-icons/io'
import { MdEdit, MdDeleteForever } from 'react-icons/md'
import { FaCircleQuestion } from 'react-icons/fa6'

const Brand = () => {
  const [companies, setCompanies] = useState([])
  const [activeDB, setActiveDB] = useState(
    sessionStorage.getItem('activeDB') || '',
  )
  const containerRef = useRef(null)
  const fromDb = sessionStorage.getItem('mainDB') || ''

  const updateActiveDb = (newActiveDB) => {
    setActiveDB(newActiveDB)
  }
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sideMenu, setsideMenu] = useState(false)
  const { category } = useParams()
  const [categories, setCategories] = useState([])

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentBrand, setCurrentBrand] = useState(null)
  const [newBrand, setNewBrand] = useState('')
  const [newBrandImage, setNewBrandImage] = useState(null)
  const userToken = sessionStorage.getItem('authToken')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSelectedBrand(null) // Unselect category
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  // Capitalize the category
  const capitalizedCategory = category ? category.toUpperCase() : ''

  useEffect(() => {
    fetchBrands()
    getCategories()
  }, [activeDB])
  useEffect(() => {
    fetchBrands()
  }, [category])
  const fetchBrands = () => {
    setIsLoading(true)
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/brands/getBrands?deviceType=${capitalizedCategory}`,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        },
      )
      .then((res) => {
        console.log('brands res:', res?.data?.dbList)
        console.log('brands data:', res?.data?.data)
        setCompanies(res?.data?.dbList)
        setBrands(res?.data?.data)
        setIsLoading(false)
      })
      .catch((err) => {
        setCompanies(err?.response?.data?.dbList)
        console.error(err)
        setIsLoading(false)
      })
  }
  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/getAll`,
        {
          headers: { Authorization: userToken, activeDB: activeDB },
        },
      )
      setCategories(data.data)
    } catch (err) {
      console.log(err)
    }
  }
  const handleDelete = (id) => {
    setIsLoading(true)
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_ENDPOINT
        }/api/brands/delete-brand-category`,
        {
          // correct spelling delete
          id: id,
          category: capitalizedCategory,
        },
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        },
      )
      .then((res) => {
        fetchBrands()
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }

  const handleAddBrand = async () => {
    try {
      setIsLoading(true)

      // Determine the endpoint based on editing state
      const endpoint = isEditing
        ? `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/brands/update-brand`
        : `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/brands/add-brand`

      let profilePhotoUrl = null

      // Check if a file is provided for newBrandImage
      // if (newBrandImage) {
      //   // Request a pre-signed URL from the backend
      //   const response = await axios.post(
      //     `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/s3/get-presigned-url`,
      //   {
      //         fileName: newBrandImage.name,
      //         fileType: newBrandImage.type,
      //     }, {
      //       headers: {
      //         Authorization: `${userToken}`,
      //         activeDB: activeDB,
      //       }
      //   },
      //   );

      //   const urlS3 = response.data.url;

      //   // Upload the file directly to S3 using the pre-signed URL
      //   const uploadResponse = await axios.put(urlS3, newBrandImage, {
      //     headers: {
      //       "Content-Type": newBrandImage.type || "application/octet-stream",
      //     },
      //   });

      //   if (uploadResponse.status === 200) {
      //     console.log(`${newBrandImage.name} uploaded successfully!`);

      //     // Extract the base URL from the pre-signed URL
      //     profilePhotoUrl = urlS3.split("?")[0];
      //   } else {
      //     throw new Error("Failed to upload profile picture to S3.");
      //   }
      // }

      // Prepare form data for submission
      const payload = new FormData()
      payload.append('id', currentBrand?._id)
      payload.append('brandName', newBrand)
      payload.append('category', capitalizedCategory)
      payload.append('files', newBrandImage)

      // Submit the data to the backend
      await axios.post(endpoint, payload, {
        headers: {
          Authorization: `${userToken}`,
          activeDB: activeDB,
        },
      })

      // Handle successful brand addition
      fetchBrands()
      setIsPopupOpen(false)
      resetForm()
    } catch (err) {
      console.error(err.message || 'Error adding brand')
      alert(`Error: ${err.message || 'Something went wrong!'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const openEditPopup = (brand) => {
    setIsPopupOpen(true)
    setIsEditing(true)
    setCurrentBrand(brand)
    setNewBrand(brand?.name)
    setNewBrandImage(brand?.logo)
  }

  const resetForm = () => {
    setNewBrand('')
    setNewBrandImage('')
    setIsEditing(false)
    setCurrentBrand(null)
    setIsLoading(false)
  }
  const handleNext = (category) => {
    navigate('/products/' + category)
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
      <div className='items-start flex py-8 justify-center min-h-screen bg-slate-100'>
        <div className='flex flex-col w-screen'>
          <div ref={containerRef}>
            <div className='relative mb-6 flex items-center justify-between gap-2 border-b-2 pb-2 ml-10'>
              <p className='text-4xl font-bold'>
                Manage Brands -{' '}
                <span className='text-primary'>
                  {
                    categories.find((item) => item.categoryCode === category)
                      ?.categoryName
                  }
                </span>
              </p>
              {selectedBrand && (
                <div className='ml-10 flex items-center justify-end pr-10 gap-4'>
                  <button
                    onClick={() => openEditPopup(selectedBrand)}
                    className='font-medium text-sm text-white px-4 py-2 rounded bg-primary'
                  >
                    Edit Brand
                  </button>
                  <button
                    onClick={() => {
                      setBrandToDelete(selectedBrand._id)
                      setIsDeleteConfirmOpen(true)
                    }}
                    className='font-medium text-sm text-white px-4 py-2 rounded bg-red-500'
                  >
                    Delete Brand
                  </button>
                  <button
                    onClick={() => handleNext(selectedBrand?._id)}
                    className='font-medium text-sm text-white px-4 py-2 rounded bg-blue-500'
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            <div className='mt-8 mx-10 flex flex-wrap gap-6'>
              <div
                onClick={() => {
                  setIsPopupOpen(true)
                  setIsEditing(false)
                }}
                className='w-40 h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-md'
              >
                <span className='text-primary text-4xl font-bold'>+</span>
              </div>
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-40 h-40 border rounded-lg shadow-lg p-4 flex flex-col justify-center items-center text-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
                    selectedBrand?._id === brand._id
                      ? 'border-primary bg-gray-50'
                      : ''
                  } ${fromDb !== activeDB && brand?.status === 'Initiated' ? 'border-2 border-yellow-300' : ''}`}
                >
                  <img src={brand?.logo} alt='' className='rounded-lg' />
                  <p className='text-lg font-medium text-gray-700'>
                    {brand.name}
                  </p>
                </div>
              ))}

              {/* No Categories Found */}
              {brands.length === 0 && (
                <div className='text-center text-gray-500 py-4 w-full'>
                  No categories found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
            <IoClose
              size={24}
              className='absolute top-3 right-3 text-primary cursor-pointer'
              onClick={() => setIsPopupOpen(false)}
            />
            <h3 className='text-xl font-bold mb-4'>
              {isEditing ? 'Edit Brand' : 'Add New Brand'}
            </h3>
            <div className='mb-4'>
              <label className='block font-medium mb-2'>Brand Name</label>
              <input
                type='text'
                className='border-2 px-3 py-2 rounded-lg w-full outline-none'
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
              />
            </div>
            <div className='space-y-1 text-center  bg-slate-100 p-2 rounded-lg mb-4'>
              <label
                htmlFor='files'
                className='relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500'
              >
                <div className='flex flex-col items-center justify-center text-sm text-gray-600'>
                  <svg
                    className='mx-auto h-12 w-12 text-gray-400'
                    stroke='currentColor'
                    fill='none'
                    viewBox='0 0 48 48'
                    aria-hidden='true'
                  >
                    <path
                      d='M28 8a6 6 0 00-12 0v12a6 6 0 0012 0V12h8v14a6 6 0 01-12 0v-2'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M36 36v2a6 6 0 01-6 6H18a6 6 0 01-6-6v-2'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>{' '}
                  <span className='bg-slate-100'>Upload Logo</span>
                  <input
                    id='files'
                    name='files'
                    type='file'
                    className='sr-only'
                    onChange={(e) => setNewBrandImage(e.target.files[0])}
                  />
                </div>
                <p className='text-xs text-gray-500'>Up to 10MB per file</p>
              </label>
              {newBrandImage && (
                <div className='mt-2 text-gray-500'>{newBrandImage?.name}</div>
              )}
            </div>
            <button
              onClick={handleAddBrand}
              disabled={isLoading} // Disable button when loading
              className={`w-full py-2 rounded font-medium ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-primary text-white'
              }`}
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <svg
                    className='animate-spin h-5 w-5 mr-2 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Please wait...
                </div>
              ) : isEditing ? (
                'Update'
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      )}
      {isDeleteConfirmOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 shadow-lg w-80'>
            <h2 className='text-lg font-semibold mb-4 text-center'>
              Confirm Delete
            </h2>
            <p className='text-sm text-gray-600 mb-6 text-center'>
              Are you sure you want to delete this brand? This action cannot be
              undone.
            </p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false)
                  setBrandToDelete(null)
                }}
                className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(brandToDelete)
                  setIsDeleteConfirmOpen(false)
                }}
                className='px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Brand
