import { orderBeers, useBeers, User } from '../api'
import { AlertBox, dispatchError } from '../components/AlertBox'
import { OrderCard } from '../components/OrderCard'
import '../css/order.css'
import { useIntUrlFragment } from '../hooks'
import { roundPrice, toPrice } from '../locales'

interface Props {
  user: User
}

export function OrderPage(props: Props) {
  const barId = useIntUrlFragment()
  const [beers, setBeers] = useBeers(barId)

  const handleInput = (id: number, orderedQuantity: number) => {
    setBeers(beers.map(b => b.id === id ? { ...b, orderedQuantity } : b))
  }

  const handleClick = async () => {
    const orders = beers
      .filter(b => b.orderedQuantity !== 0)
      .map(b => ({ id: b.id, orderedQuantity: b.orderedQuantity }))
    try {
      await orderBeers(props.user.token, orders)
      setBeers(beers.map(b => ({ ...b, orderedQuantity: 0 })))
    } catch (err) {
      dispatchError(err as Error)
    }
  }

  const total = beers.reduce((a, b) => a + b.orderedQuantity * roundPrice(b.sellingPrice), 0)

  return (
    <>
      <AlertBox />
      <div class="orders">
        {beers.map(b => (
          <OrderCard key={b.id} beer={b} onInput={handleInput} />
        ))}
      </div>
      <button onClick={handleClick}>Commander</button>
      <span>Total : {toPrice(total)}</span>
    </>
  )
}
