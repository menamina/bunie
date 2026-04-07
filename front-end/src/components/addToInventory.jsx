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
            <label htmlFor="brand">Brand name:</label>
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
            <label htmlFor="product">Product name:</label>
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
            <label htmlFor="category">Category name:</label>
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
            <label htmlFor="price">Price name:</label>
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
            <input
              name="file"
              type="file"
              value={inventoryINFO.img}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  img: e.target.value,
                }));
              }}
            />
          </div>
          <div className="status">
            <label htmlFor="status">Status name:</label>
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
          <div className="backup">
            <label htmlFor="backup">Backup:</label>
            <input
              name="backup"
              type="text"
              value={inventoryINFO.backup}
              onChange={(e) => {
                setInventoryINFO((prev) => ({
                  ...prev,
                  backup: e.target.value,
                }));
              }}
            />
          <div className="purchaseDate">
            <label htmlFor="purchaseDate">Purchase Date:</label>
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
                  <label htmlFor="brand">Brand name:</label>
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
          <div className="notes">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
          </div>
          <div className="wouldBuyAgain">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
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
