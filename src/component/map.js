import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import ReactDOM from 'react-dom';

class Map extends Component {
  
  onScriptLoad() {
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options
    );
    //this.props.updateMap(map);
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = `https://maps.google.com/maps/api/js?key=`+ process.env.REACT_APP_GOOGLE_MAP_API_KEY;
      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
      s.addEventListener("load", e => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.points !== this.props.points && window.google ) {
      
      this.onScriptLoad();
    }
  }
  render() {
    
    return (
      <div
        style={{ height: this.props.height, width: "100%" }}
        id={this.props.id}
      />
    );
  }
}

export default Map;