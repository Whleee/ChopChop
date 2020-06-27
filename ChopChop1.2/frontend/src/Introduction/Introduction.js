import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const styles = {
  CardHeader: {
    fontSize: '50px',
    fontWeight: 'bold',
    fontFamily: 'Courier New',
  },

  CardBody: {
    fontSize: '30px',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    color: 'black',
  },
};

class Introduction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      intro: null,
    };
  }

  async componentDidMount() {
    const introduction = (await axios.get('http://localhost:8081/')).data;
    this.setState({
      introduction,
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row" style = {{paddingTop: '220px'}}>
            <div className="card text-white bg-info mb-3">
              <div className="card-header" style = {styles.CardHeader}>
                Finding what to do FAST.
              </div>
              <div className="card-body">
                <h4 className="card-title" style = {styles.CardBody}>
                  <p>Unsure of what to do due to the overwhelming amount of choices?</p>

                  <p>Fret not, try ChopChop!</p>

                  <p>After deciding how far you want to travel and the type of activity you want,
                  ChopChop finds all the activities near you and gives you one such thing to
                  do based on your preferences!</p> 
                </h4>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default Introduction;
