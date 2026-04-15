import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductMutOpts, updateProductMut } from "../ts-queries/queries";

function AddToInventory({ closeInventoryModal, product = null }) {
  const editMode = product ? true : false;
  const queryClient = useQueryClient();

  const {
    mutate: addProduct,
    isPending: pendingProductAdd,
    error: errorAddingProduct,
    reset: resetAddProduct,
  } = useMutation({
    ...addProductMutOpts(),
    onSuccess: () => {
      clearInventoryINFO();
      resetAddProduct();
    },
  });

  const { mutate: updateProduct, isPending: updatePending } = useMutation({
    ...updateProductMut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["view-status"] });
      closeInventoryModal();
    },
  });

  const [inventoryINFO, setInventoryINFO] = useState(
    !product
      ? {
          brand: "",
          product: "",
          category: "",
          price: "",
          img: "",
          status: "",
          backup: "",
          purchaseDate: "",
          rating: "",
          notes: "",
          wouldBuyAgain: "",
        }
      : {
          brand: product.brand,
          product: product.product,
          category: product.category,
          price: product.price,
          img: product.img,
          status: product.status,
          backup: product.backup || "",
          purchaseDate: product.purchaseDate || "",
          rating: product.rating || "",
          notes: product.notes || "",
          wouldBuyAgain: product.wouldBuyAgain || "",
        },
  );

  function clearInventoryINFO(e) {
    e.preventDefault();
    closeInventoryModal(false);
    setInventoryINFO({
      brand: "",
      product: "",
      category: "",
      price: "",
      img: "",
      status: "",
      backup: "",
      purchaseDate: "",
      rating: "",
      notes: "",
      wouldBuyAgain: "",
    });
  }

  function submit() {
    editMode ? updateProduct(inventoryINFO) : addProduct(inventoryINFO);
  }

  return (
    <div className="addToInventoryModal" onClick={clearInventoryINFO}>
      {errorAddingProduct && <div>{errorAddingProduct}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div>
          <div className="brand">
            <label htmlFor="brand">Brand:</label>
            <input
              name="brand"
              type="text"
              value={inventoryINFO.brand}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  brand: e.target.value,
                }));
              }}
              required
            />
          </div>
          <div className="product">
            <label htmlFor="product">Product:</label>
            <input
              name="product"
              type="text"
              value={inventoryINFO.product}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  product: e.target.value,
                }));
              }}
              required
            />
          </div>
          <div className="category">
            <label htmlFor="category">Category:</label>
            <input
              name="category"
              type="text"
              value={inventoryINFO.category}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  category: e.target.value,
                }));
              }}
              required
            />
          </div>
          <div className="price">
            <label htmlFor="price">Price:</label>
            <input
              name="price"
              type="text"
              value={inventoryINFO.price}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  price: e.target.value,
                }));
              }}
              required
            />
          </div>
          <div className="img">
            <label htmlFor="img">Image:</label>
            {inventoryINFO.img.length > 0 && (
              <div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setInventoryINFO((prev) => ({ ...prev, img: "" }));
                  }}
                >
                  X
                </div>
                <img
                  src={URL.createObjectURL(inventoryINFO.img)}
                  alt="preview"
                />
              </div>
            )}
            <input
              name="file"
              type="file"
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  img: e.target.files[0],
                }));
              }}
              required
            />
          </div>
          <div className="status">
            <label htmlFor="status">Label:</label>
            <input
              name="status"
              type="text"
              value={inventoryINFO.status}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  status: e.target.value,
                }));
              }}
            />
          </div>
          <div className="purchaseDate">
            <label htmlFor="purchaseDate">Purchase Date?</label>
            <input
              name="purchaseDate"
              type="text"
              value={inventoryINFO.purchaseDate}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  purchaseDate: e.target.value,
                }));
              }}
            />
          </div>
          <div className="rating">
            <fieldset>
              <legend>Current rating:</legend>
              <div>
                <input
                  type="radio"
                  name="rating"
                  value="1"
                  checked={inventoryINFO.rating === "1"}
                  onChange={(e) => {
                    setInventoryINFO((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }));
                  }}
                />
                <label>1</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="rating"
                  value="2"
                  checked={inventoryINFO.rating === "2"}
                  onChange={(e) => {
                    setInventoryINFO((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }));
                  }}
                />
                <label>2</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="rating"
                  value="3"
                  checked={inventoryINFO.rating === "3"}
                  onChange={(e) => {
                    setInventoryINFO((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }));
                  }}
                />
                <label>3</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="rating"
                  value="4"
                  checked={inventoryINFO.rating === "4"}
                  onChange={(e) => {
                    setInventoryINFO((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }));
                  }}
                />
                <label>4</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="rating"
                  value="5"
                  checked={inventoryINFO.rating === "5"}
                  onChange={(e) => {
                    setInventoryINFO((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }));
                  }}
                />
                <label>5</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="rating"
                  value="n/a"
                  checked={inventoryINFO.rating === "n/a"}
                  onChange={(e) => {
                    setInventoryINFO((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }));
                  }}
                  required
                />
                <label>n/a</label>
              </div>
            </fieldset>
          </div>
          <div className="notes">
            <label htmlFor="notes">Notes?</label>
            <textarea
              name="notes"
              type="text"
              value={inventoryINFO.notes}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }));
              }}
            />
          </div>
          <div className="wouldBuyAgain">
            <label htmlFor="wouldBuyAgain">
              Would you repurchase/use this product again?
            </label>
            <select
              name="wouldBuyAgain"
              type="text"
              value={inventoryINFO.wouldBuyAgain}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  wouldBuyAgain: e.target.value,
                }));
              }}
              required
            >
              <option value="null">n/a</option>
              <option value="yes">yes</option>
              <option value="no">no</option>
              <option value="maybe">maybe</option>
              <option value="ifItWasGifted">if it was a gift</option>
            </select>
          </div>
        </div>
        <div>
          {editMode && !updatePending && (
            <>
              <button className="can click">update</button>
              <div className="can click" onClick={closeInventoryModal}>
                cancel
              </div>
            </>
          )}
          {editMode && updatePending && (
            <>
              <div className="cannot click">update</div>
              <div className="cannot click" onClick={closeInventoryModal}>
                cancel
              </div>
            </>
          )}
          {!editMode && !pendingProductAdd && (
            <>
              <button className="can click">add</button>
              <div className="can click" onClick={closeInventoryModal}>
                cancel
              </div>
            </>
          )}
          {!editMode && pendingProductAdd && (
            <>
              <div className="cannot click">add</div>
              <div className="cannot click" onClick={closeInventoryModal}>
                cancel
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddToInventory;
