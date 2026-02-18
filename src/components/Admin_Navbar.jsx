import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminNavbar({ setsideMenu, sideMenu, onActiveDbChange }) {
  const navigate = useNavigate()

  const userToken = sessionStorage.getItem('authToken')
  const activeDB = sessionStorage.getItem('activeDB') || ''
  const profile = JSON.parse(sessionStorage.getItem('profile') || '{}')
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'User'
  const initials = fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const [companies, setCompanies] = useState([])

  useEffect(() => {
    fetchDbs()
  }, [activeDB])

  const fetchDbs = () => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_ENDPOINT}/api/category/getDbList`,
        {
          headers: {
            Authorization: `${userToken}`,
            activeDB: activeDB,
          },
        },
      )
      .then((res) => {
        setCompanies(res?.data?.dbList)
      })
      .catch((err) => {
        setCompanies(err?.response?.data?.dbList)
        console.error(err)
      })
  }

  return (
    <>
      <div className='flex items-center justify-between w-full h-16 px-6 py-2 bg-white shadow-md border-b'>
        {/* Hamburger Menu */}
        <div
          className='relative flex flex-col justify-between w-[22px] h-[18px] cursor-pointer z-[40] transition-all duration-300 ease-in-out'
          onClick={() => setsideMenu(!sideMenu)}
        >
          <span className='w-full h-[2px] bg-gray-700'></span>
          <span className='w-full h-[2px] bg-gray-700'></span>
          <span className='w-full h-[2px] bg-gray-700'></span>
        </div>

        {/* Logo and Database Selector */}
        <div className='flex items-center gap-6'>
          {/* Logo */}
          {/* Active DB */}
          <div
            className='cursor-pointer text-sm font-semibold text-gray-700 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-all duration-300'
            onClick={() => navigate('/companies')}
          >
            {activeDB}
          </div>
        </div>

        {/* Profile */}
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-[#EC2752] flex items-center justify-center text-white text-xs font-bold flex-shrink-0'>
            {initials}
          </div>
          <span className='text-sm font-medium text-gray-700 hidden sm:block'>{fullName}</span>
        </div>
      </div>
    </>
  )
}

export default AdminNavbar
