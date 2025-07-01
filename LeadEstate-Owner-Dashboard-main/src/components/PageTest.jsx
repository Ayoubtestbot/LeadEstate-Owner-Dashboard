import React from 'react'

const PageTest = ({ pageName }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <strong>PAGE TEST:</strong> {pageName} component is loading correctly!
      <br />
      <small>Build timestamp: {new Date().toISOString()}</small>
    </div>
  )
}

export default PageTest
