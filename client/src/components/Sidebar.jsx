import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import assets from '../assets/assets'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Input
} from '@/components/ui/input'
import {
  SparklesIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const filteredUsers = input
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users

  useEffect(() => {
    getUsers()
  }, [onlineUsers])

  return (
    <aside
      className={`h-full w-full bg-muted/10 p-4 rounded-r-xl overflow-y-auto scrollbar-thin scrollbar-thumb-muted/40 scrollbar-track-transparent ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      {/* Top Section */}
      <div className="pb-4 space-y-4">
        {/* Branding + Menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold text-primary">
            <span>TalkDesk</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SparklesIcon className="h-7 w-7 text-primary cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-48 rounded-xl">
              <DropdownMenuItem
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-sm"
              >
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search user..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pl-10 text-sm rounded-full bg-muted/20 border-muted"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-1">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id
          const hasUnseen = unseenMessages[user._id] > 0

          return (
            <div
              key={user._id}
              onClick={() => {
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
                setSelectedUser(user);
              }}
              className={`flex items-center gap-3 rounded-lg p-2 cursor-pointer hover:bg-accent/20 relative transition ${
                isSelected ? "bg-accent/10" : ""
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="avatar"
                className="w-10 h-10 shrink-0 rounded-full object-cover border border-border"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{user.fullName}</p>
                <p
                  className={`text-xs ${
                    onlineUsers.includes(user._id)
                      ? "text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </p>
              </div>
              {hasUnseen && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-[10px] rounded-full bg-primary text-white flex items-center justify-center">
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  )
}

export default Sidebar
