import React from 'react'
import { Link } from 'react-router-dom';
import "./index.scss";
const IndexPage = () => {
  return (
    <div className='navigate'>
      <Link to="/react-micro-one">micro-one</Link>
      <Link to="/react-micro-two">micro-two</Link>
    </div>
  )
}

export default IndexPage;