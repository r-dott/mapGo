import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState ,useContext} from "react";
import Map, { Marker, NavigationControl, Popup, ScaleControl} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import pin from './locp.svg';
import { UserContext } from "../App";

export const Userhome = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const getUserPrivate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/private", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      if(res.status===200){
        dispatch({type:"USER", payload:"user"});

      }
      else if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
      navigate("/signin");
    }
  };
  useEffect(() => {
    getUserPrivate();
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [Events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/showevents", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        console.log("this is data");
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  console.log("this is events");
  console.log(Events);


  // const marks = [{
  //   id: 1,
  //   name: "OAT",
  //   lng: 80.22990184208273,
  //   lat: 26.505257661670083,
  //   events: [
  //     {
  //       SNo : 1,
  //       event: "Book Club Event",
  //       Details: "A Book fair followed by a treasure hunt!!!... Dont miss out on the fun."
  //     },
  //     {
  //       SNo : 2,
  //       event: "MClub Night",
  //       Details: "This is another acoustic night. Come join us to relax and have fun!!"
  //     }
  //   ]
  // },
  // {
  //   id: 2,
  //   name: "CCD",
  //   lng: 80.2342585835755,
  //   lat: 26.51197348008671,
  //   events: [
  //     {
  //       SNo : 1,
  //       event: "Book Club Event",
  //       Details: "A Book fair followed by a treasure hunt!!!... Dont miss out on the fun."
  //     },
  //     {
  //       SNo : 2,
  //       event: "MClub Night",
  //       Details: "This is another acoustic night. Come join us to relax and have fun!!"
  //     },
  //     {
  //       SNo : 3,
  //       event: "MClub Night",
  //       Details: "This is another acoustic night. Come join us to relax and have fun!!"
  //     }
  //   ]
  // }];

  const mapper = Events.map((mark) =>
    <Marker id={mark._id} longitude={mark.longitude} latitude={mark.latitude}><button
      className="marker-btn"
      onClick={e => {
        setSelectedEvent(mark);
        // console.log(mark);
      }}
      style={{background:"none", border:"none"}}
    ><img src={pin} width={25} /></button></Marker>
  );







  const [hosts, setHosts] = useState([]);

  let data;

  const getHosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/showhosts", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      data = await res.json();
      setHosts(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHosts();
  }, []);

  return (
    <>
      <div className="userHome" style={{display:"flex"}}>
        <div className="sidebar" style={{flex:"1"}}>
          <div className="sidebar-top">
            <i className="logo fab fa-sketch"></i>
            <span className="brand">The App</span>
          </div>
          <div className="sidebar-center">
            <ul className="list">
              {hosts.map((elem) => {
                return (
                  <li className="list-item">
                    <i className="list-item-icon fas fa-search"></i>
                    <span className="list-item-text">{elem.hostname}</span>
                  </li>
                )
              })}

            </ul>
          </div>
        </div>
        <div className="child" style={{flex:"1", width:"85%"}}>
        <div>
        
<Map
  initialViewState={{
    longitude: 80.23289680480958,
    latitude: 26.511402242762095,
    zoom: 16,
    pitch: 35,
    // bearing:50,
    maxBounds: [[80.21972179412843, 26.49669310356472], [80.24988999430397, 26.53040995882184]],
    logoPosition: 'bottom-right',
    testMode: true
  }} 
  mapboxAccessToken="pk.eyJ1Ijoicm9oYW5yMjEiLCJhIjoiY2xmMWMyZ2Q1MDZ6cTNzbnY4Y2FqYXFxMSJ9.Ppuy03i7T2TG4jcY8ldqpQ"
  style={{ width: '100vw', height: '100vh' }}
  mapStyle="mapbox://styles/mapbox/streets-v9"
  attributionControl={false}
> 
<ScaleControl/> 
  <NavigationControl position='top-left' />
  {mapper}
  
</Map>
<button style={{bottom:"10px", right:"10px", position: "fixed", textDecoration:"none", borderRadius:"10px", textAlign:"center", paddingRight:"10px"}}><a href="/navigation.html" style={{textDecoration:"none", color:"#111827", textAlign:"center"}}>click here for<br></br><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DIRECTIONS</b></a></button>
{selectedEvent ? (
    <div>
      <button style={{top:"40vh" ,right:"10px", position: "fixed", borderRadius:"10px", textAlign:"left", paddingRight:"10px", width:"13%"}}><b>{selectedEvent.eventname} by {selectedEvent.hostname}</b><br></br>Date :&nbsp;{selectedEvent.startTime.slice(0, 10)}<br></br>Time :&nbsp;{selectedEvent.startTime.slice(11, 16)}<br></br>{selectedEvent.description}  </button>
    </div>
  ) : null
  }
</div>
        </div>
      </div>
    </>
  );
};
