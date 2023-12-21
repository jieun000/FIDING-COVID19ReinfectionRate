import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import './login.css'
import Chart from './Chart';
import SeoulMap from './SeoulMap';
import { hangjungdong } from './hangjungdong';
import ApiFetch from './ApiFetch';
import AiFetch from './AiFetch';
const { gu, ro, da } = hangjungdong;

const LoginMain = ({ login }) => {
  // 데이터를 저장하는 상태
  const [data, setData] = useState(null);
  // 로딩 상태를 추적하는 상태
  const [isLoading, setIsLoading] = useState(true);
  // 오류를 추적하는 상태
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState();
  const [sessionAddress, setSessionAddress] = useState("강동구");
  const [sessionAddress3, setSessionAddress3] = useState("1080012200");
  const [sessionLocCode, setSessionLocCode] = useState("1080012200");
  const [newWeatherData, setNewWeatherData] = useState();

  // apiFetch를 위해 설정
  const apiFetchRef = useRef(null);
  const aiFetchRef = useRef(null);

  const [pyCharmData, setPyCharmData] = useState(null);
  
  const [loadKey, setLoadKey] = useState("");

  const [districtKey, setDistrictKey] = useState("강동구");
  const [AllAirQualityData, setAllAirQualityData] = useState({});
  const [newAirQualityData, setNewAirQualityData] = useState({});
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [finedust, setFinedust] = useState(null);
  const [ultrafinedust, setUltrafinedust] = useState(null);

  const [dataPost, setDataPost] = useState({});
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [val3, setVal3] = useState("");

  var obj = { 
    sessionAddress, 
    sessionAddress3, 
    sessionLocCode, 
    districtKey,
    setDistrictKey, 
    AllAirQualityData,
    setAllAirQualityData,
    newAirQualityData,
    setNewAirQualityData,
    setTemperature,
    setHumidity,
    setFinedust,
    setUltrafinedust,
    setDataPost,
    setVal1,
    loadKey
  }
  var aiObj = {
    dataPost,
    setPyCharmData, 
    loadKey
  }
  useEffect(() => {
    // 세션 정보를 가져오기 위한 API 요청
    axios.get('/LoginMain')
      .then(response => {
        // 세션 데이터를 React state에 저장
        // console.log("서버로 온 데이터 ", response.data);
        if (response.data != null) {
          login(true);
          setSessionAddress(response.data.address1);
          setSessionLocCode(response.data.addLoccode);
          setSessionAddress3(response.data.address3);
          setLoadKey(obj.sessionLocCode);
          console.log('DB 주소: ', obj.sessionAddress, 'DB locCode: ', obj.sessionLocCode);
        }
        setSessionData(response.data);
        // console.log(apiFetchRef, "는 무엇")
        // 자식 컴포넌트인 ApiFetch의 ref를 설정합니다.
        if (apiFetchRef.current) {
          apiFetchRef.current.fetchData();
        }
        console.log("loadKey다!!!!!!!!!!!!!!!!!!!", loadKey)
        // fetchData()
      })
      .catch(error => {
        console.error('세션 정보 가져오기 실패:', error);
      });
  }, []);


  const checkWorkPlace = (workPlaceYN) => {
    return workPlaceYN === 1 ? '예' : '아니오';
  };

  var addList = []
  var second = ro
  .filter((el) => el.gu === val1)
  .map((el,idx) => (
    <option key={idx} value={el.ro}>
      {el.ro}
    </option>
    ))
  var third = da.filter((el) => el.gu === val1 && el.ro === val2)
  .map((el) => {addList.push(el)
    return el
  })
  .map((el,idx) => (
    <option key={idx} value={el.da}>
      {el.da}
    </option>
  ))

  return (
    <>
    <ApiFetch obj={obj} ref={apiFetchRef} />
    <AiFetch obj={aiObj} ref={aiFetchRef} />
      <div className='gridContainer' style={{ margin: '30px 50px' }}>
        <div id='gridItem1' style={{ border: '5px solid rgba(100, 149, 237, 0.7)',  borderRadius: '15px', textAlign:'center'}}>
          <p style={{fontSize: '48px', textAlign:'center',color:'black'}}>서울시 전체 미세먼지 현황</p>
          {sessionData ? (
            <div style={{fontSize: '20px'}}> 
              <span style={{color: 'blue'}}> 좋음 😍 </span> <span style={{color: 'green'}}> 보통 😀 </span> <span style={{color: 'orange'}}> 나쁨 😒 </span> <span style={{color: 'red'}}> 아주 나쁨 😫</span>
              
              <div className="validate-input m-b-23" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', padding: '20px 0px 0px 0px', marginBottom: '0px'}}>
                <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '20px'}}>
                  <div>
                    <span className="label-input100" ></span>
                    <span>도로를 선택하세요.</span>
                    <select className="input100" type="text" name="address2" onChange={(e) => setVal2(e.target.value)}>
                    <option value="">선택</option>
                    {second}
                    </select>
                    <span className="focus-input100_2" data-symbol="&#xf206;"></span>
                  </div>
              </div>
              <div>
                  <span className="label-input100"></span>
                  <select className="input100" type="text" name="address3" onChange={(e) => setLoadKey(e.target.value)}>
                  <option value="">선택</option>
                    {third}
                  </select>
                  <span className="focus-input100_2" data-symbol="&#xf206;"></span>
                </div>
            </div>
            <br/>
            </div>
          ) : (
            <p>로딩 중...</p>
          )}
          <SeoulMap airQualityData1={AllAirQualityData} setDistrictKey={(i)=> setDistrictKey(i)} />
        </div>
        <div id='gridItem2' style={{ border: '5px solid rgba(167, 212, 131, 0.7)',  borderRadius: '15px' , fontSize: '48px', textAlign:'center'}}><p style={{fontSize: '48px', textAlign:'center',color:'black'}}>나의 동네 대기 정보</p>
          {sessionData ? (
            <div> 
              <p style={{fontSize:'24px'}}> 🖐️ {sessionData.username}님</p>
              <p style={{fontSize:'16px'}}>거주지 : {sessionData.address1} {sessionData.address2} / 출근지 : {sessionData.workPlace1} {sessionData.workPlace2} <br></br> 취약계층 : {sessionData.vgroups} / 취약환경여부 : {checkWorkPlace(sessionData.workPlaceYN)}</p> 
            </div>
          ) : (
            <p>로딩 중...</p>
          )}
          <div style={{ border: '#DCEDC8', borderRadius: '15px', margin:'30px 50px', background:'#fff9c4'}}><p style={{fontSize:'18px'}}>기온 {temperature}℃ / 습도 {humidity}% </p></div>
          <div style={{ border: '#DCEDC8', borderRadius: '15px', margin:'30px 50px', background:'#fff9c4'}}><p style={{fontSize:'18px'}}> 
          <img src="./finedust.png" width="175"></img> <img src="./ultrafinedust.png" width="160"></img><br></br>
          {finedust}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ultrafinedust} </p></div>
          <Chart airQualityData2={newAirQualityData} pyCharmData={pyCharmData} />
            <div style={{ border: '#DCEDC8', borderRadius: '15px', margin:'30px 50px', background:'#DCEDC8'}}><p style={{fontSize:'18px'}}> 여기는 사용자의 정보에 따라서 안내문구가 달라질 예정입니다 <br></br> 여기는 사용자의 정보에 따라서 안내문구가 달라질 예정입니다 <br></br>  여기는 사용자의 정보에 따라서 안내문구가 달라질 예정입니다 </p></div>
          </div>
        </div>
      </>
  );
}

export default LoginMain;