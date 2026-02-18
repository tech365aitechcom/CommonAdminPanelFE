import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminNavbar from '../Admin_Navbar'
import SideMenu from '../SideMenu'
import { BeatLoader } from 'react-spinners'

const MODULE_FIELDS = [
  { key: 'adminModels', label: 'Admin Models' },
  { key: 'gradePricing', label: 'Grade Pricing' },
  { key: 'registerUser', label: 'Register User' },
  { key: 'storeListing', label: 'Store Listing' },
  { key: 'storeReport', label: 'Store Report' },
  { key: 'customerTable', label: 'Customer Table' },
  { key: 'quoteTracking', label: 'Quote Tracking' },
  { key: 'companyListing', label: 'Company Listing' },
  { key: 'pickupCancelDevice', label: 'Pickup Cancel Device' },
  { key: 'technicianReport', label: 'Technician Report' },
  { key: 'createCoupon', label: 'Create Coupon' },
  { key: 'bulkUploadHistory', label: 'Bulk Upload History' },
  { key: 'adminDashboard', label: 'Admin Dashboard' },
]

const ModuleSetting = () => {
  const [modules, setModules] = useState({})
  const [sideMenu, setsideMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const userToken = sessionStorage.getItem('authToken')
  const [activeDB, setActiveDB] = useState(
    sessionStorage.getItem('activeDB') || '',
  )

  useEffect(() => {
    fetchModules()
  }, [])

  const updateActiveDb = (newActiveDB) => setActiveDB(newActiveDB)

  const fetchModules = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/module/getModule`,
        {
          headers: {
            Authorization: userToken,
            activeDB,
          },
        },
      )
      if (!res.data || Object.keys(res.data).length === 0) {
        await createModule() // fallback creation
      } else {
        setModules(res.data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      await createModule() // fallback creation
    } finally {
      setLoading(false)
    }
  }

  const createModule = async () => {
    try {
      const defaultModules = {}
      MODULE_FIELDS.forEach(({ key }) => {
        defaultModules[key] = false
      })

      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/module/createModule`,
        defaultModules,
        {
          headers: {
            Authorization: userToken,
            activeDB,
          },
        },
      )
      setModules(res.data)
      toast.success('New module configuration initialized.')
    } catch (error) {
      toast.error('Failed to create default module configuration.')
      console.error('Create error:', error)
    }
  }

  const handleToggle = (key) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {}
      MODULE_FIELDS.forEach(({ key }) => {
        if (key in modules) payload[key] = modules[key]
      })

      await axios.put(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/module/updateModule`,
        payload,
        {
          headers: {
            Authorization: userToken,
            activeDB,
          },
        },
      )
      toast.success('Modules updated successfully.')
    } catch {
      toast.error('Failed to update module settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50'>
        <BeatLoader color='var(--primary-color)' loading={loading} size={15} />
      </div>
    )
  }
  // if (activeDB === "UnicornUAT") {
  //   return (
  //     <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
  //       <h1 className="font-bold text-white text-2xl text-opacity-90">
  //         You Cannot Edit modules for MasterDB
  //       </h1>
  //     </div>
  //   );
  // }

  return (
    <div className='flex flex-col min-h-screen bg-slate-100'>
      <div className='navbar'>
        <AdminNavbar
          setsideMenu={setsideMenu}
          sideMenu={sideMenu}
          onActiveDbChange={updateActiveDb}
        />
        <SideMenu setsideMenu={setsideMenu} sideMenu={sideMenu} />
      </div>

      <main className='flex-grow mt-24 px-4'>
        <div className='max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8'>
          <h1 className='text-3xl font-semibold text-gray-800 mb-6'>
            Module Settings
          </h1>
          {activeDB !== 'UnicornUAT' ? (
            <div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {MODULE_FIELDS.map(({ key, label }) => (
                  <label key={key} className='flex items-center space-x-3'>
                    <input
                      type='checkbox'
                      checked={!!modules[key]}
                      onChange={() => handleToggle(key)}
                      className='w-5 h-5 accent-primary text-primary border-primary focus:ring-primary'
                    />
                    <span className='text-gray-700'>{label}</span>
                  </label>
                ))}
              </div>

              <div className='mt-8 text-right'>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-tertiary transition disabled:opacity-50'
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className='flex justify-center'>
              <h1 className='font-bold text-2xl text-opacity-90'>
                You Cannot Edit modules for MasterDB!
              </h1>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ModuleSetting
