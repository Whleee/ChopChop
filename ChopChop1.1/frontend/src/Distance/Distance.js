import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

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

class Distance extends Component {
  constructor(props) {
    super(props);

    this.state = {
        distance: '',
    };
  }

  async componentDidMount() {
    const distance = (await axios.get('http://localhost:8081/')).data;
    this.setState({
      distance,
    });
  }

  updateAnswer(value) {
    this.setState({
      distance: value,
    });
  }

  submit() {
    this.props.submitDistance(this.state.distance);

    this.setState({
      distance: '',
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row" style = {{paddingTop: '10px'}}>
            <div className="card text-white bg-success mb-3">
              <div className="card-header" style = {styles.CardHeader}>
                How far do you want to go?
              </div>
            </div>
                <div className="card text-white bg-success mb-3" style = {styles.CardBody}>
                    <div className="card-header">Distance: </div>
                    <div className="card-body">
                        <form>
                            <label>
                                Maximum Distance:
                                <input 
                                    type = "number" 
                                    name = "distance" 
                                    placeholder = " Enter here!"
                                    onChange={(e) => {this.updateAnswer(e.target.value)}}
                                /> 
                            </label>
                            <button
                                className="btn btn-warning"
                                style = {styles.CardBody}
                                onClick={() => {this.submit()}}>
                                Submit
                            </button>
                        </form>
                        {
                            this.props.distance
                        }
                    </div>
                  </div>
              </div>
        </div>
    )
  }
}

export default withRouter(Distance);