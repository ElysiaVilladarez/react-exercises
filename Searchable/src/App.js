import { useState } from "react";
import PRODUCTS from "./data.json"

function SearchBar({filterText, inStockOnly, onFilterTextChanged, onInStockOnlyChanged}) {
  return (
    <div>
      <div>
        <input type="text" placeholder="Search . . ." value={filterText} onChange={(e) => onFilterTextChanged(e.target.value)}/>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={inStockOnly} onChange={(e) => onInStockOnlyChanged(e.target.checked)}/>
          {' '}
          Only show products in stock
        </label>
      </div>
    </div>
  )
}

function ProductTable({products, filterText, inStockOnly}) {
  const rows = [];
  let lastCategory = null;
  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return
    }
    if (inStockOnly && !product.stocked) {
      return
    }
    if (product.category !== lastCategory) {
      rows.push((
        <ProductCategoryRow category={product.category} key={product.category} />
      ))
    }
    rows.push((
      <ProductRow product={product} key={product.name} />
    ));
    lastCategory = product.category
  })
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  )
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name : (
    <span style={{ color: 'red' }}>
      {product.name}
    </span>
  );
  return (
    <tr>
      <td> {name} </td>
      <td> {product.price} </td>
    </tr>
  )
}

function FilterableProductTable({products}) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar filterText={filterText} inStockOnly={inStockOnly}
                 onFilterTextChanged={setFilterText} onInStockOnlyChanged={setInStockOnly}/>
      <ProductTable products={products} filterText={filterText} inStockOnly={inStockOnly}/>
    </div>
  )
}


export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}