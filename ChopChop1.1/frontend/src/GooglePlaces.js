import { Map, GoogleAPiWrapper } from 'google-maps-react';

const mapStyles = {
    width: '50%',
    height: '50%',
}

class GooglePlaces extends Component {
    render() {
        return (
            <Map
                google = {this.props.google}
                zoom = {8}
                style = {mapStyles}
                initialCenter= {{lat: 47.444, lng: -122.176}}
            />
        )
    }
}

export default GooglePlaces;