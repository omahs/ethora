import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, devtools } from 'zustand/middleware'

type TUser = {
  firstName: string
  lastName: string
  xmppPassword: string
  _id: string
  walletAddress: string
  token: string
  refreshToken: string
}

type TOwner = {
  _id: string
  firstName: string
  lastName: string
  token: string
}

type TMode = 'light' | 'dark'

type TBalance = {
  balance: number,
  tokenName: string,
  tokenType: string,
  contractAddress: string,
  imagePreview?: string,
  total: number
}

type TMessage = {
  body: string
  firsName: string
  lastName: string
  wallet: string
  from: string
  room: string
}

export type TMessageHistory = {
  id: number
  body: string
  data: {
    isSystemMessage: string,
    photoURL: string,
    quickReplies: string,
    roomJid: string,
    senderFirstName: string,
    senderJID: string,
    senderLastName: string,
    senderWalletAddress: string,
    tokenAmount: string,
    xmlns: string
  },
  roomJID: string
  date: string
  key: number
}

type TUserChatRooms = {
  jid: string
  name: string
  room_background: string
  room_thumbnail: string
  users_cnt: string
}

type TApp = {
  _id: string,
  appName: string,
  appToken: string,
  createdAt: string,
  updatedAt: string,
  defaultAccessAssetsOpen: boolean,
  defaultAccessProfileOpen: boolean,
  usersCanFree: string,
  appGoogleId?: string,
  appLogo?: string,
}

interface IStore {
  user: TUser
  owner: TOwner
  messages: TMessage[],
  viewMode: TMode,
  balance: TBalance[],
  apps: TApp[],
  toggleMode: () => void,
  setUser: (user: TUser) => void,
  setOwner: (owner: TOwner) => void,
  clearUser: () => void,
  clearOwner: () => void,
  setBalance: (balance: TBalance[]) => void,
  setNewMessage: (msg: TMessage) => void,
  historyMessages: TMessageHistory[],
  setNewMessageHistory: (msg: TMessageHistory) => void
  updateMessageHistory: (messages: TMessageHistory[]) => void
  clearMessageHistory: () => void,
  sortMessageHistory: () => void,
  userChatRooms: TUserChatRooms[],
  setNewUserChatRoom: (msg: TUserChatRooms) => void
  clearUserChatRooms: () => void,
  setApps: (apps: TApp[]) => void,
  setApp: (app: TApp) => void,
  updateApp: (app: TApp) => void,
  deleteApp: (id: string) => void,
  loaderArchive: boolean,
  setLoaderArchive: (status: boolean) => void
}

const _useStore = create<IStore>()(devtools(persist(immer((set, get) => {
  return {
    user: {
      firstName: '',
      lastName: '',
      xmppPassword: '',
      _id: '',
      walletAddress: '',
      token: '',
      refreshToken: ''
    },
    owner: {
      firstName: '',
      lastName: '',
      token: '',
      _id: '',
    },
    apps: [],
    balance: [],
    viewMode: 'light',
    messages: [],
    historyMessages: [],
    loaderArchive: false,
    userChatRooms: [],
    toggleMode: () => set((state) => {state.viewMode = state.viewMode === 'light' ? 'dark' : 'light'}),
    setUser: (user: TUser) => set((state) => {state.user = user}),
    setOwner: (user: TOwner) => set((state) => {
      console.log('setOwner ', user)
      state.owner = user
    }),
    setApps: (apps: TApp[]) => set((state) => {state.apps = apps}),
    setApp: (app: TApp) => set((state) => {state.apps = [...state.apps, app]}),
    updateApp: (app: TApp) => set((state) => {
      const index = state.apps.findIndex((el) => el._id === app._id)
      state.apps.splice(index, 1, app)
      state.apps = [...state.apps]
    }),
    deleteApp: (id: string) => set((state) => {
      const apps = state.apps.filter(app => app._id !== id)
      state.apps = [...apps]
    }),
    clearApps: () => set((state) => {state.apps = []}),
    clearUser: () => set((state) => {
      state.user = {
        firstName: '',
        lastName: '',
        xmppPassword: '',
        _id: '',
        walletAddress: '',
        token: '',
        refreshToken: ''
      }
    }),
    clearOwner: () => set((state) => {
      state.owner = {
        firstName: '',
        lastName: '',
        token: '',
        _id: ''
      }
    }),
    setBalance: (balance: TBalance[]) => set((state) => {state.balance = balance}),
    setNewMessage: (message: TMessage) => set((state) => {
      console.log('setNewMessage')
      state.messages.unshift(message)
    }),
    setNewMessageHistory: (historyMessages: TMessageHistory) => set((state) => {
      console.log('setNewMessageHistory')
      state.historyMessages.unshift(historyMessages)
    }),
    updateMessageHistory: (messages: TMessageHistory[]) => set((state) => {
      console.log('updateMessageHistory')
      // state.historyMessages.push(messages);
      console.log(state.historyMessages, messages)
      state.historyMessages = [...state.historyMessages, ...messages];

      state.historyMessages.sort((a: any, b: any) => a.id - b.id);

      // state.historyMessages.unshift(historyMessages)
    }),
    setLoaderArchive: (status: boolean) => set((state) => {
      state.loaderArchive = status;
    }),
    clearMessageHistory: () => set((state) => {
      state.historyMessages = [];
    }),
    sortMessageHistory: () => set((state) => {
      state.historyMessages.sort((a: any, b: any) => a.id - b.id);
    }),
    setNewUserChatRoom: (userChatRooms: TUserChatRooms) => set((state) => {
      state.userChatRooms.unshift(userChatRooms)
    }),
    clearUserChatRooms: () => set((state) => {
      state.userChatRooms = [];

    }),
  }
}))))

declare global {
  interface Window { useState: any; }
}

window.useState = _useStore

export const useStoreState = _useStore
