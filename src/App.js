import './App.css';
import {useState, useEffect} from 'react';
import house from './assets/living-room.jpg';
const sensorURL = "http://vsrstud07.informatik.tu-chemnitz.de:8983";

function App() {
    const [lightState, setLightState] = useState('');
    const [heaterState, setHeaterState] = useState('');
    const [lightIntensity, setLightIntensity] = useState('');
    const [fanState, setFanState] = useState('');
    const [fanSpeed, setFanSpeed] = useState('');
    const [temperature, setTemperatureValue] = useState('');

    console.log("sensor "+ sensorURL);

    useEffect(() => {
        const fanCal = (fanSpeed) => {
            const speedRangeMin = 100;
            const speedRangeMax = 1000;

            const normalizedSpeed = (fanSpeed - speedRangeMin) / (speedRangeMax - speedRangeMin);
            const speedValue = 1 - normalizedSpeed;

            return speedValue;
        }
        // Function to request data from the REST API
        const fetchTemperature = async () => {
            try {
                const response = await fetch(sensorURL+'/temperature/1');
                const data = await response.json();
                setTemperatureValue(data.value);
            } catch (error) {
                console.log('Error fetching temperature:', error);
            }
        };

        const fetchLight = async () => {
            try {
                const response = await fetch(sensorURL+'/ambientlight/1');
                const data = await response.json();
                setLightState(data.state);
                setLightIntensity(data.intensity);
            } catch (error) {
                console.log('Error fetching light:', error);
            }
        };

        const fetchHeater = async () => {
            try {
                const response = await fetch(sensorURL+'/heating/1');
                const data = await response.json();
                setHeaterState(data.state);
            } catch (error) {
                console.log('Error fetching heater:', error);
            }
        };

        const fetchFan = async () => {
            try {
                const response = await fetch(sensorURL+'/fan/1');
                const data = await response.json();
                setFanState(data.state);
                const normalizedSpeed = fanCal(data.speed)
                setFanSpeed(normalizedSpeed.toString());
            } catch (error) {
                console.log('Error fetching fan:', error);
            }
        };

        const fetchData = () => {
            fetchTemperature();
            fetchLight();
            fetchFan();
            fetchHeater();
        };

        fetchData()

        const checkDataChange = setInterval(fetchData, 2000); // Check every 5 seconds

        return () => {
            clearInterval(checkDataChange); // Clean up the interval when component unmounts
        };
    }, []);

    return (
        <div style={{width: "100%", height: "100vh", color: "#fff", overflowY: "hidden"}}>
            <h5>Smart Home Environment</h5>
            <div className="house">
                <img src={house} alt="s" style={{
                    width: "100%",
                    height: "100vh",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    zIndex: "-999"
                }}/>
                <>
                    <div className="illuminate-area" style={{display: `${lightState == "on" ? 'block' : 'none'}`}}></div>
                    <div className="bulbOn" style={{display: `${lightState == "on" ? 'block' : 'none'}`}}></div>
                </>
                <div className="fan-area">
                    <div className="fan fan-1">
                        <div className="core-part"  style={{ animationDuration: `${fanSpeed}s`, animationPlayState: `${fanState == 'off' ? 'paused' : 'running' }` }}>
                            <div className="wing wing-1"></div>
                            <div className="wing wing-2"></div>
                            <div className="wing wing-3"></div>
                            <div className="wing wing-4"></div>
                            <div className="wing wing-5"></div>
                            <div className="wing wing-6"></div>
                        </div>
                    </div>
                    <div className="fan fan-2"></div>
                    <div className="fan fan-3">
                        <div className="fan-buttons">
                            <div className="fan-button"></div>
                            <div className="fan-button"></div>
                            <div className="fan-button"></div>
                            <div className="fan-button"></div>
                        </div>
                    </div>
                </div>

                <div style={{position: "absolute", left: "0", fontSize: "10px"}}>
                    <h2>Light State: {lightState} | Light Intensity: {lightIntensity}</h2>
                    <h2>Fan State: {fanState}</h2>
                    <h2>Heater State: {heaterState}</h2>
                    <h2>Temperature: {temperature}</h2>
                </div>
            </div>
        </div>
    );
}

export default App;

