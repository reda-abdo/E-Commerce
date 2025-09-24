import React from 'react'
import { Button } from '../ui'
import { Loader2, ShoppingCart } from 'lucide-react'

interface AddCartButtonProps {
  productQuantity: number,
  addCartLoading: boolean,
  handelAddToCart: () => void,
}


export default function AddProdcutCartButton({ productQuantity, addCartLoading, handelAddToCart }: AddCartButtonProps) {
  return (
    <Button
      size="lg"
      className="flex-1 cursor-pointer w-full "
      disabled={productQuantity === 0 || addCartLoading}
      onClick={handelAddToCart}

    >
      {addCartLoading && <Loader2 className=" animate-spin" />}
      <ShoppingCart className="h-5 w-5 mr-2 " />
      Add to Cart
    </Button>
  )
}
