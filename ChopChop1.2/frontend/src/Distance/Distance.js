import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import api from '../api';
import auth0Client from "../Auth";
import { auth } from 'firebase';

const styles = {
  CardHeader: {
    fontSize: '50px',
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    color: "black",
  },

  CardBody: {
    fontSize: '30px',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: 'black',
  },
};

class Distance extends Component {

  constructor(props) {
    super(props);

    this.state = {
        userID: '',
        distance: ''
    };
  }

  async componentDidMount() {
    const distance = (await axios.get('http://localhost:8000/')).data;
    this.setState({
      distance,
    });
  }

  updateAnswer(value) {
    let ID = ''
    if (auth0Client.isAuthenticated()) {
      ID = auth0Client.getProfile().name
    }  
    this.setState({
      userID: ID,
      distance: value,
    });
  }

  handleIncludeData = async () => {
    const { userID, distance } = this.state
    const payload = { userID, distance }

    await api.insertData(payload).then(res => {
        window.alert(`Data inserted successfully`)
        this.setState({
            userID: '',
            distance: ''
        })
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row" style = {{paddingTop: '0px'}}>
            <div className="card text-black bg-warning mb-3">
              <div className="card-header" style = {styles.CardHeader}>
                Click on Search to begin!
              </div>
            </div>
              </div>
        </div>
    )
  }
}

export default Distance;