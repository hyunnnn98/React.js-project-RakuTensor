// modules
import React, { useState, useEffect, createRef } from 'react'
import ReactLoading from 'react-loading';
import axios from 'axios'

// components
import ResultChart from './components/ResultChart'

// const
import { SERVER_URL, IMAGE_COUNT, FIRST_OBJ, SECOND_OBJ, THIRD_OBJ } from './utils/const'

// urils
import converImgSrc from './utils/convertImgSrc'

// style
import './App.css';

const App = () => {
  // 로딩 컨트롤
  const [isLoading, setIsLoading] = useState(false)

  // 서버로부터 객체 리스트 저장
  const [objList, setObjList] = useState([])
  const [resultArr, setResultArr] = useState([0])

  // 이미지 주소 저장
  const [firstObjImgs, setFirstObjImgs] = useState([])
  const [secondObjImgs, setSecondObjImgs] = useState([])
  const [thirdObjImgs, setThirdObjImgs] = useState([])

  // 선택된 객체
  const [firstObj, setFirstObj] = useState(null)
  const [secondObj, setSecondObj] = useState(null)
  const [thirdObj, setThirdObj] = useState(null)

  // 객체 인식 전역 카운팅
  const [count, setCount] = useState(Number(1))
  const selectFirstRef = createRef()
  const selectSecondRef = createRef()
  const selectThirdRef = createRef()

  useEffect(async () => {
    try {
      const { data } = await axios.get(SERVER_URL + '/tensor/api/obj_list');
      console.log(data);
      setObjList(data.list)
    } catch (e) {
      console.error(e);
    }
  }, [])

  useEffect(() => {
    if (firstObj !== null && secondObj !== null) {
      if (firstObj === secondObj) {
        alert("같은 객체는 선택할 수 없습니다.")
        handleInit()
      }
    }

  }, [firstObj, secondObj])

  useEffect(async () => {
    if (count > 1 && !isLoading) {
      console.log("이미지 리로딩!")

      setIsLoading(true)

      try {
        const { data } = await axios.post(SERVER_URL + '/tensor/api/train', {
          'objects': [firstObj, secondObj, thirdObj],
          count
        });
        console.log(`${count - 1}회차 신뢰치?`, data.result);
        setResultArr([...resultArr, data.result])
      } catch (e) {
        alert("서버로부터 데이터를 받아올 수 없습니다.")
        handleInit();
        // console.error(e);
      }

      setIsLoading(false)

      // 이미지 리로딩
      handleRefreshImage('first', firstObj)
      handleRefreshImage('second', secondObj)
      handleRefreshImage('third', thirdObj)
    }

  }, [count])

  const handleSave = () => {
    if (count < 2) {
      return alert('모델 저장은 1차 객체 실험 후 가능합니다.')
    }
    // django 로 부터 해당 모델 저장값 가져오기.
    // alert('저장..')
  }

  const handleTest = () => {
    if (firstObj === null || secondObj === null || thirdObj === null) {
      return alert('객체를 선택해주세요.')
    }

    if (count > 10) {
      return alert('객체 인식 실험은 최대 10번까지 가능합니다.')
    }

    // 카운트 증가
    setCount(prevCount => ++prevCount)
  }

  const handleChange = (e, target) => {
    const targetValue = e.target.value

    switch (target) {
      case FIRST_OBJ:
        setFirstObj(targetValue)
        break;
      case SECOND_OBJ:
        setSecondObj(targetValue)
        break;
      case THIRD_OBJ:
        setThirdObj(targetValue)
        break;
      default:
        break;
    }

    handleRefreshImage(target, targetValue)
  };

  const handleRefreshImage = (target, targetValue) => {
    // <<-- 불러올 사진 정보
    // const startIndex = IMAGE_COUNT * (count - 1) + 1
    const startIndex = 1
    const endIndex = IMAGE_COUNT * count
    // -->>

    let imgSrc = ''
    let imgArr = []

    for (let index = startIndex; index <= endIndex; index++) {
      imgSrc = SERVER_URL + converImgSrc(targetValue, index)
      imgArr.push(imgSrc)
    }

    switch (target) {
      case FIRST_OBJ:
        setFirstObjImgs(imgArr)
        break;
      case SECOND_OBJ:
        setSecondObjImgs(imgArr)
        break;
      case THIRD_OBJ:
        setThirdObjImgs(imgArr)
        break;
      default:
        break;
    }
  }

  const handleInit = () => {
    // 이미지 셋 초기화
    setFirstObjImgs([])
    setSecondObjImgs([])
    setThirdObjImgs([])
    // 선택 객체 초기화
    setFirstObj(null)
    setSecondObj(null)
    setThirdObj(null)
    selectFirstRef.current.value = 'default'
    selectSecondRef.current.value = 'default'
    selectThirdRef.current.value = 'default'
    // 카운팅 초기화
    setCount(Number(1))
    setResultArr([0])
  }

  return (
    <>
      {
        isLoading ?
          <div className="loading-container">
            <ReactLoading type='spinningBubbles' height={100} width={100}>
            </ReactLoading>
            <div className="loading-text">로딩중...</div>
          </div> : null
      }
      <div style={{ height: 20 }} />
      <div className="body-container">
        <div className="main-title">Raku Tensor</div>
        <div className="select-container">
          <div className="select-left-container">
            <div className="select-box">
              <div>첫번째 객체를 선택해주세요</div>
              <select
                defaultValue="default"
                value={firstObj}
                onChange={(e) => handleChange(e, FIRST_OBJ)}
                ref={selectFirstRef}
                name="object"
              >
                <option value="default" disabled>객체선택</option>
                {
                  objList.map((item, index) => <option key={index} value={item}>{item}</option>)
                }
              </select>
            </div>
            <div className="select-box">
              <div onClick={() => handleTest()} className="btn-test-container">{count} 차 객체 인식 실험</div>
              <div onClick={handleInit} className="btn-test-container color-blue">객체 초기화</div>
            </div>
          </div>
          <div className="select-right-container">
            <div className="image-container">
              {
                firstObj !== null && firstObjImgs.map((image, index) =>
                  (index >= IMAGE_COUNT * (count - 1) && index <= IMAGE_COUNT * count) ?
                    <div key={`${image}-${index}`} className="image-item">
                      <img className="image-item-img" src={image} alt='' />
                    </div>
                    : null
                )
              }
            </div>
          </div>
        </div>
        <div className="result-container">
          <div style={{ fontSize: 25, fontWeight: 900 }}>
            <span className="obj-title">{firstObj}</span>
            &
            <span className="obj-title">{secondObj}</span>
            &
            <span className="obj-title">{thirdObj}</span>
          </div>
          <div>
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
              결과
            </div>
            <ResultChart resultArr={resultArr} />
          </div>
        </div>
        <div className="select-container">
          <div className="select-left-container">
            <div className="select-box">
              <div>두번째 객체를 선택해주세요</div>
              <select
                value={secondObj}
                defaultValue="default"
                onChange={(e) => handleChange(e, SECOND_OBJ)}
                ref={selectSecondRef}
                name="object"
              >
                <option value="default" disabled>객체선택</option>
                {
                  objList.map((item, index) =>
                    <option key={index} value={item}>{item}</option>
                  )
                }
              </select>
            </div>
            <div className="select-box">
              <div onClick={handleSave} className="btn-test-container color-dark">모델 저장</div>
            </div>
          </div>
          <div className="select-right-container">
            <div className="image-container">
              {
                secondObj !== null && secondObjImgs.map((image, index) =>
                  (index >= IMAGE_COUNT * (count - 1) && index <= IMAGE_COUNT * count) ?
                    <div key={`${image}-${index}`} className="image-item">
                      <img className="image-item-img" src={image} alt='' />
                    </div>
                    : null
                )
              }
            </div>
          </div>
        </div>
        <div className="result-container">
          {/* <ResultChart /> */}
        </div>
        <div className="select-container">
          <div className="select-left-container">
            <div className="select-box">
              <div>세번째 객체를 선택해주세요</div>
              <select
                value={thirdObj}
                defaultValue="default"
                onChange={(e) => handleChange(e, THIRD_OBJ)}
                ref={selectThirdRef}
                name="object"
              >
                <option value="default" disabled>객체선택</option>
                {
                  objList.map((item, index) =>
                    <option key={index} value={item}>{item}</option>
                  )
                }
              </select>
            </div>
            <div className="select-box">
            </div>
          </div>
          <div className="select-right-container">
            <div className="image-container">
              {
                thirdObj !== null && thirdObjImgs.map((image, index) =>
                  (index >= IMAGE_COUNT * (count - 1) && index <= IMAGE_COUNT * count) ?
                    <div key={`${image}-${index}`} className="image-item">
                      <img className="image-item-img" src={image} alt='' />
                    </div>
                    : null
                )
              }
            </div>
          </div>
        </div>
        <div className="result-container">
          {/* <ResultChart /> */}
        </div>
      </div>
    </>
  )
}

export default App;
