import { useState } from "react";

function AddToInventory({ closeInventoryModal }) {
  const [inventoryINFO, setInventoryINFO] = useState({
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

  function addToInventory() {
    clearInventoryINFO();
  }

  return (
    <div className="addToInventoryModal" onClick={clearInventoryINFO}>
      <form onSubmit={addToInventory}>
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
                ></div>
                <img
                  src={URL.createObjectURL(inventoryINFO.img)}
                  alt="preview"
                />
              </div>
            )}
            <input
              name="file"
              type="file"
              value={inventoryINFO.img}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  img: e.target.file,
                }));
              }}
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
            <label htmlFor="rating">Rating?</label>
            <select
              name="rating"
              type="text"
              value={inventoryINFO.rating}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  rating: e.target.value,
                }));
              }}
            >
              <option value="null">n/a</option>
              <option value="yes">yes</option>
              <option value="no">no</option>
              <option value="maybe">maybe</option>
              <option value="ifItWasGifted">if it was a gift</option>
            </select>
          </div>
          <div className="notes">
            <label htmlFor="notes">Notes?</label>
            <input
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
          <button className="">add</button>
          <div className="" onClick={clearInventoryINFO}>
            cancel
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddToInventory;
