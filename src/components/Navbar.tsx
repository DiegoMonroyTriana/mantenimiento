'use client'

import {
  type FailureDescriptionType,
  type FailureType,
  type MachineType,
  type UserType
} from '@/types/tables'
import { HomeIcon, LogoutIcon, MenuIcon, NoteIcon, ToolIcon } from './icons'
import useStore from '@/store/useStore'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import dynamic from 'next/dynamic'

function Navbar ({
  machines,
  failureDescriptions,
  failureTypes,
  user,
  children
}: {
  machines: MachineType[] | null
  failureDescriptions: FailureDescriptionType[] | null
  failureTypes: FailureType[] | null
  user: UserType[] | null
  children: React.ReactNode
}) {
  const {
    setMachines,
    setFailureDescriptions,
    setFailureTypes,
    setUser,
    machines: storeMachines,
    failureDescriptions: storeFailureDescriptions,
    failureTypes: storeFailureTypes,
    user: storeUser
  } = useStore()
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const { push, refresh } = useRouter()
  const { user: currentUser } = useStore()
  const menuOptions = [
    {
      name: 'Inicio',
      route: '/home',
      icon: <HomeIcon className="w-6 h-6" />
    },
    {
      name: 'Registro',
      route: '/home/register',
      icon: <NoteIcon className="w-6 h-6" />
    },
    {
      name: 'Mis trabajos',
      route: '/home/works',
      icon: <ToolIcon className="w-6 h-6" />
    }
  ]
  if (
    storeMachines !== null &&
    storeFailureDescriptions !== null &&
    storeFailureTypes !== null &&
    storeUser !== null &&
    !pathname.includes('/home')
  ) {
    push('/home')
  }

  function handleMenuOpen () {
    setMenuOpen(!menuOpen)
  }

  async function handleLogout () {
    await supabase.auth.signOut()
    refresh()
  }

  useEffect(() => {
    if (
      machines === null ||
      failureDescriptions === null ||
      failureTypes === null ||
      user === null
    ) {
      return
    }
    setMachines(machines)
    setFailureDescriptions(failureDescriptions)
    setFailureTypes(failureTypes)
    setUser(user[0])
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  if (currentUser === null) return null

  return (
    <main className="w-full h-screen transition-all bg-gray-50/60">
      <nav className="w-full py-4 px-4 h-16 bg-mariner-950 flex flex-row justify-between fixed">
        <button onClick={handleMenuOpen}>
          <MenuIcon className="text-white w-6 h-6" />
        </button>
        <div className="flex flex-row gap-3 items-center justify-center">
          <p className="text-mariner-50 uppercase">{currentUser.name}</p>
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            width={30}
            height={30}
            className="rounded-full object-contain"
          />
        </div>
      </nav>
      {children}
      {menuOpen
        ? (
        <section className="grid grid-cols-[auto_1fr]">
          <aside className="bg-mariner-950 h-screen absolute left-0 top-0 bottom-0 py-10 z-10 pr-12 pl-4 flex flex-col justify-between">
            <ul className="flex flex-col gap-5">
              {menuOptions.map((option) => (
                <li
                  className="text-white text-xl font-medium hover:text-mariner-200 transition-all flex flex-row gap-2 items-center"
                  key={option.name}>
                  {option.icon}
                  <Link href={option.route}>{option.name}</Link>
                </li>
              ))}
            </ul>
            <button className="text-white text-xl font-medium hover:text-mariner-200 transition-all flex flex-row gap-2 items-center" onClick={handleLogout}>
                Cerrar sesión
                <LogoutIcon className='w-6 h-6' />
            </button>
          </aside>
          <div
            className="w-full h-screen bg-black bg-opacity-50 absolute top-0 left-0"
            onClick={handleMenuOpen}></div>
        </section>
          )
        : null}
    </main>
  )
}

export default dynamic(async () => await Promise.resolve(Navbar), {
  ssr: false
})
