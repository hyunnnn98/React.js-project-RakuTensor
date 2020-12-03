// modules
import React, { useState, useEffect, createRef } from 'react'
import axios from 'axios'

// const
import { SERVER_URL, IMAGE_COUNT, FIRST_OBJ, SECOND_OBJ } from './const'

// urils
import converImgSrc from './utils/convertImgSrc'

// style
import './App.css';

const App = () => {
  // 서버로부터 객체 리스트 저장
  const [objList, setObjList] = useState([])

  // 이미지 주소 저장
  const [firstObjImgs, setFirstObjImgs] = useState([])
  const [secondObjImgs, setSecondObjImgs] = useState([])

  // 선택된 객체
  const [firstObj, setFirstObj] = useState(null)
  const [secondObj, setSecondObj] = useState(null)

  // 객체 인식 전역 카운팅
  const [count, setCount] = useState(Number(1))
  const selectFirstRef = createRef()
  const selectSecondRef = createRef()

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

  useEffect(() => {
    if(count > 1) {
      console.log("이미지 리로딩!")
      // 이미지 리로딩
      handleRefreshImage('first', firstObj)
      handleRefreshImage('second', secondObj)
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
    if (firstObj === null || secondObj === null) {
      return alert('객체를 선택해주세요.')
    }

    if (count > 85) {
      return alert('객체 인식 실험은 최대 85번까지 가능합니다.')
    }

    // 카운트 증가
    setCount(prevCount => ++prevCount)
  }

  const handleChange = (e, target) => {
    const targetValue = e.target.value

    const isFirstTarget = target === 'first'

    isFirstTarget ? setFirstObj(targetValue) : setSecondObj(targetValue)

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

    target === 'first' ? setFirstObjImgs(imgArr) : setSecondObjImgs(imgArr)
  }

  const handleInit = () => {
    // 이미지 셋 초기화
    setFirstObjImgs([])
    setSecondObjImgs([])
    // 선택 객체 초기화
    setFirstObj(null)
    setSecondObj(null)
    selectFirstRef.current.value = 'default'
    selectSecondRef.current.value = 'default'
    // 카운팅 초기화
    setCount(Number(1))
  }

  return (
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
            <div onClick={handleInit} className="btn-test-container color-blue">객체 초기화</div>
          </div>
        </div>
        <div className="select-right-container">
          <div className="image-container">
            {
              firstObj !== null && firstObjImgs.map((image, index) =>
                (index >= IMAGE_COUNT * (count - 1) && index <= IMAGE_COUNT * count) ?
                  <div key={`${image}-${index}`} className="image-item">
                  <img className="image-item-img" src={image} />
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
            <div onClick={() => handleTest()} className="btn-test-container">{count} 차 객체 인식 실험</div>
            <div onClick={handleSave} className="btn-test-container color-dark">모델 저장</div>
          </div>
        </div>
        <div className="select-right-container">
          <div className="image-container">
            {
              secondObj !== null && secondObjImgs.map((image, index) =>
                (index >= IMAGE_COUNT * (count - 1) && index <= IMAGE_COUNT * count) ?
                  <div key={`${image}-${index}`} className="image-item">
                    <img className="image-item-img" src={image} />
                  </div>
                  : null
              )
            }
          </div>
        </div>
      </div>
      <div className="result-container">
        {/* <div id="chartContainer" style="height: 370px; width: 50%;"></div> */}
        {/* <div className="result-items">{count}차 결과 ...</div>
        <div className="result-items">{count}차 결과 ...</div>
        <div className="result-items">{count}차 결과 ...</div>
        <div className="result-items">{count}차 결과 ...</div> */}
      </div>
    </div >
  );
}

export default App;
