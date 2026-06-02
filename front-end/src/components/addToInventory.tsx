import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductMutOpts, updateProductMut } from "../ts-queries/queries";

import UploadIMG from "../imgs/uploadPic.svg";

interface AddEditInv {
  closeInventoryModal: any;
  product?: any;
  user: any;
}

function AddToInventory({
  closeInventoryModal,
  product = null,
  user,
}: AddEditInv) {
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
      queryClient.invalidateQueries({
        queryKey: ["view-status", user.username],
      });
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
          category: "makeup",
          price: "",
          img: [],
          status: "noStatus",
          backup: "",
          purchaseDate: "",
          rating: "na",
          notes: "",
          wouldBuyAgain: "na",
        }
      : {
          brand: product.brand,
          product: product.product,
          category: product.category,
          price: product.price,
          img: product.img ? [product.img] : [],
          status: product.status,
          backup: product.backup || "",
          purchaseDate: product.purchaseDate || "",
          rating: product.rating || "",
          notes: product.notes || "",
          wouldBuyAgain: product.wouldBuyAgain || "",
        },
  );

  function clearInventoryINFO(e?: any) {
    if (e) e.stopPropagation();
    closeInventoryModal(false);
  }

  function submit(e: any) {
    e.preventDefault();
    void (editMode
      ? updateProduct({ productID: product.id, productData: inventoryINFO })
      : addProduct(inventoryINFO));
    closeInventoryModal(false);
  }

  return (
    <div className="addToInventoryModal">
      {errorAddingProduct && <div>{(errorAddingProduct as any).error}</div>}
      <form
        onClick={(e) => e.stopPropagation()}
        className="addToInvenForm"
        onSubmit={(e) => submit(e)}
      >
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
          <label>Category:</label>
          <select
            name="category"
            value={inventoryINFO.category}
            onChange={(e) => {
              e.stopPropagation();
              setInventoryINFO((prev) => ({
                ...prev,
                category: e.target.value,
              }));
            }}
          >
            <option value="makeup">makeup.</option>
            <option value="skincare">skincare.</option>
          </select>
        </div>
        <div className="price">
          <label htmlFor="price">Price:</label>
          <input
            name="price"
            type="number"
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
          {inventoryINFO.img.length === 1 && (
            <div className="previewIvenPhoto">
              <button
                className="dltPicX"
                onClick={(e) => {
                  e.preventDefault();
                  setInventoryINFO((prev) => ({ ...prev, img: [] }));
                }}
                type="button"
              >
                X
              </button>
              <img
                src={
                  typeof inventoryINFO.img[0] === "string"
                    ? `http://localhost:5555/IMGS-API/${inventoryINFO.img[0]}`
                    : URL.createObjectURL(inventoryINFO.img[0])
                }
                alt="preview"
                className="preview"
              />
            </div>
          )}
          {inventoryINFO.img.length > 1 &&
            inventoryINFO.img.map((img, index) => (
              <div key={index} className="previewIvenPhoto">
                <button
                  className="dltPicX"
                  onClick={(e) => {
                    e.preventDefault();
                    setInventoryINFO((prev) => ({ ...prev, img: [] }));
                  }}
                  type="button"
                >
                  X
                </button>
                <img
                  src={
                    typeof img === "string"
                      ? `http://localhost:5555/IMGS-API/${img}`
                      : URL.createObjectURL(img)
                  }
                  alt="preview"
                  className="preview"
                />
              </div>
            ))}
          {inventoryINFO.img.length === 0 ? (
            <div>
              <img
                src={UploadIMG}
                alt="upload image icon"
                onClick={(e) => (e.currentTarget.nextElementSibling as HTMLInputElement)?.click()}
                className="curs0r upload img"
              />
              <input
                name="file"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.currentTarget.files?.[0]) {
                    setInventoryINFO((prev) => ({
                      ...prev,
                      img: [e.currentTarget.files![0]],
                    }));
                  }
                }}
                required
              />
            </div>
          ) : null}
        </div>
        <div className="status">
          <label>Status:</label>
          <select
            name="status"
            value={inventoryINFO.status}
            onChange={(e) => {
              setInventoryINFO((prev) => ({
                ...prev,
                status: e.target.value,
              }));
            }}
            required
          >
            <option value="noStatus">none</option>
            <option value="inProgress">in progress</option>
            <option value="limbo">limbo</option>
            <option value="decluttered">decluttered</option>
            <option value="fullpan">full pan</option>
          </select>
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
          <label>Rating:</label>
          <select
            name="rating"
            value={inventoryINFO.rating}
            onChange={(e) => {
              setInventoryINFO((prev) => ({
                ...prev,
                rating: e.target.value,
              }));
            }}
            required
          >
            <option value="na">n/a</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="notes">
          <label htmlFor="notes">Notes?</label>
          <textarea
            name="notes"
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
            value={inventoryINFO.wouldBuyAgain}
            onChange={(e) => {
              setInventoryINFO((prev) => ({
                ...prev,
                wouldBuyAgain: e.target.value,
              }));
            }}
            required
          >
            <option value="na">n/a</option>
            <option value="yes">yes</option>
            <option value="no">no</option>
            <option value="maybe">maybe</option>
            <option value="ifItWasGifted">if it was a gift</option>
          </select>
        </div>

        <div>
          {editMode &&
            !updatePending &&
            inventoryINFO.brand &&
            inventoryINFO.product &&
            inventoryINFO.category &&
            inventoryINFO.price &&
            inventoryINFO.img.length > 0 &&
            inventoryINFO.status &&
            inventoryINFO.rating &&
            inventoryINFO.wouldBuyAgain && (
              <div>
                <button
                  type="button"
                  className="can click"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeInventoryModal();
                  }}
                >
                  cancel
                </button>
                <button type="submit" className="can click">
                  update
                </button>
              </div>
            )}

          {editMode && updatePending && (
            <div>
              <button
                type="button"
                className="cannot click"
                onClick={(e) => {
                  e.stopPropagation();
                  closeInventoryModal();
                }}
              >
                cancel
              </button>
              <button type="button" className="cannot click">
                update
              </button>
            </div>
          )}

          {!editMode &&
            !pendingProductAdd &&
            inventoryINFO.brand &&
            inventoryINFO.product &&
            inventoryINFO.category &&
            inventoryINFO.price &&
            inventoryINFO.img.length > 0 &&
            inventoryINFO.status &&
            inventoryINFO.rating &&
            inventoryINFO.wouldBuyAgain && (
              <div>
                <button
                  type="button"
                  className="can click"
                  onClick={clearInventoryINFO}
                >
                  cancel
                </button>
                <button type="submit" className="can click">
                  add
                </button>
              </div>
            )}
          {!editMode &&
            !pendingProductAdd &&
            (!inventoryINFO.brand ||
              !inventoryINFO.product ||
              !inventoryINFO.category ||
              !inventoryINFO.price ||
              inventoryINFO.img.length === 0 ||
              !inventoryINFO.status ||
              !inventoryINFO.rating ||
              !inventoryINFO.wouldBuyAgain) && (
              <div>
                <button
                  type="button"
                  className="can click"
                  onClick={clearInventoryINFO}
                >
                  cancel
                </button>
                <button type="button" className="cannot click">
                  add
                </button>
              </div>
            )}
          {!editMode && pendingProductAdd && (
            <div>
              <button
                type="button"
                className="cannot click"
                onClick={clearInventoryINFO}
              >
                cancel
              </button>
              <button type="button" className="cannot click">
                add
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddToInventory;
