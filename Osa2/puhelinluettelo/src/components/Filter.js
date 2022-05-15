const Filter = ({nameFilter, handleNameFilterChange}) => {
    return (
      <>
        Filter shown with
        <input 
          value = {nameFilter} 
          onChange = {handleNameFilterChange} 
        />
      </>
    )
}

export default Filter