import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from "google-map-react";
import { connect } from "react-redux";

class GISMap extends Component {
    constructor(props) {
      super(props);
      this.onScriptLoad = this.onScriptLoad.bind(this);
    }
  
    onScriptLoad() {
        console.log("onScriptLoad");
      const map = new window.google.maps.Map(
        document.getElementById(this.props.id),
        this.props.option
      );
      this.props.onMapLoad(map);
    }
  
    componentDidMount() {
      console.log("sssssssss");
      if (!window.google) {
        console.log("start load");
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = `https://maps.google.com/maps/api/js?key=`+ process.env.GOOGLE_MAP_API_KEY;
        //var x = document.getElementsByTagName("script")[0];
        //x.parentNode.insertBefore(s, x);
        // Below is important.
        //We cannot access google.maps until it's finished loading
        s.addEventListener("load", e => {
          this.onScriptLoad();
        });
      } else {
        this.onScriptLoad();
      }
    }
  
    componentDidUpdate(prevProps, prevState) {
      if ((prevProps.flag !== this.props.flag) && window.google) {
        this.onScriptLoad();
      }
    }
  
    render() {
      console.log('render, props = ',this.props);
      return (
        // Important! Always set the container height explicitly
  
        <div style={{height: this.props.height, width: "100%"}} id={this.props.id}/>
          
        
      );
    }
  }
  
  export default GISMap;