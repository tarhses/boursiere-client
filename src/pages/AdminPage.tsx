import type { User } from '../api'
import { AdminBeers } from '../components/AdminBeers'
import { AdminStats } from '../components/AdminStats'
import { AdminUsers } from '../components/AdminUsers'
import { AlertBox } from '../components/AlertBox'

interface Props {
  user: User
}

export function AdminPage(props: Props) {
  if (!props.user.admin) {
    return (
      <p>Cette page n'est accessible qu'aux administrateurs.</p>
    )
  }

  return (
    <>
      <AlertBox />
      <AdminStats user={props.user} />
      <AdminBeers user={props.user} />
      <AdminUsers user={props.user} />
    </>
  )
}
