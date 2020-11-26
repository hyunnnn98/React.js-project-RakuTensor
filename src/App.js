import React, { useState } from 'react'

import './App.css';

const App = () => {
  const [imgs, setImgs] = useState([])
  const [count, setCount] = useState(1)
  const [objList, setObjList] = useState(['apple', 'banana', 'duck', 'car'])

  const handelSave = () => {
    if (count < 2) {
      return alert('모델 저장은 1차 객체 실험 후 가능합니다.')
    }
    // django 로 부터 해당 모델 저장값 가져오기.
    alert('저장..')
  }

  return (
    <div className="body-container">
      <div className="main-title">Raku Tensor</div>
      <div className="select-container">
        <div className="select-left-container">
          <div className="select-box">
            <div>객체를 선택해주세요</div>
            <select name="object">
              <option value="">객체선택</option>
              {
                objList.map(item => <option value={item}>{item}</option>)
              }
            </select>
          </div>
          <div className="select-box">
            <div onClick={() => setCount(prevCount => ++prevCount)} className="btn-test-container">{count} 차 객체 인식 실험</div>
            <div onClick={handelSave} className="btn-test-container color-dark">모델 저장</div>
          </div>
        </div>
        <div className="select-right-container">
          <div className="image-container">
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
            <div className="image-item">이미지</div>
          </div>
        </div>
      </div>
      <div className="result-container">
        {/* <div id="chartContainer" style="height: 370px; width: 50%;"></div> */}
        <div className="result-items">{count}차 결과 ...</div>
        <div className="result-items">{count}차 결과 ...</div>
        <div className="result-items">{count}차 결과 ...</div>
        <div className="result-items">{count}차 결과 ...</div>
      </div>
    </div>
  );
}

export default App;
