import React from 'react'
import { BounceLoader } from 'react-spinners'

export default function Loading(props) {
  return (
    <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center"
    }}>
        <BounceLoader color='#ffb400' size={props.size}/>
    </div>
  )
}
