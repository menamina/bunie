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
            <label htmlFor=""></label>
            <input
              type="text"
              value=""
              onChange={(e) => {
                set;
              }}
            />
          </div>
          <div className="product">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
          </div>
          <div className="category">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
          </div>
          <div className="price">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
          </div>
          <div className="img">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
          </div>
          <div className="status">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
          </div>
          <div className="backup">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
          </div>
          <div className="purchaseDate">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
          </div>
          <div className="rating">
            <label htmlFor=""></label>
            <input type="text" value="" onChange={(e) => {}} />
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
