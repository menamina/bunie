import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductMut } from "../ts-queries/queries";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

function EditProduct({ product, closeEdit, closeProdOpts }) {

    const [inventoryINFO, setInventoryINFO] = useState({
    brand: product.brand,
    product: product.product,
    category: product.category,
    price: product.price,
    img: product.img,
    status: product.status,
    backup: product.backup,
    purchaseDate: product.purchaseDate,
    rating: product.rating,
    notes: product.notes,
    wouldBuyAgain: product.wouldBuyAgain,
  });

    const queryClient = useQueryClient()

    const {
        mutate: updateProduct,
        error: updateErr,
        isPending: updatePending,
        reset: resetUpdate
    } = useMutation({
        ...updateProductMut();
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["view-status", ] })
        }

    })

    return (

    )

}
export default EditProduct;
