import React, {useState} from 'react';
import Masonry from 'react-masonry-infinite';
import './App.css';

function App() {
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [images, setImages] = useState([]);
  const [grayScale, setGrayScale] = useState(false);
  const [showing, setShowing] = useState(true);
  const [heights] = useState([0]);
  const [widths] = useState([0]);
  const [selectedHeight, setSelectedHeight] = useState(0);
  const [selectedWidth, setSelectedWidth] = useState(0);

  const onChange = (event) => {

    setGrayScale(event.target.checked);
    reset();
  }
  const onWidthChange = (event) => {
    setSelectedWidth(event.target.value);
    console.log(event.target.value);
    reset();
  }
  const onHeightChange = (event) => {
    setSelectedHeight(event.target.value);
    console.log(event.target.value);
    reset();
  }

  const reset = () => {
    setOffset(0);
    setHasMore(true);
    setImages([]);
    setShowing(false);
    setTimeout(()=>{setShowing(true);}, 0);
  }

  function loadMore() {
    const to=offset + 10;
    const filter = selectedHeight !== 0 || selectedWidth !== 0 ? 
      '/' + selectedWidth + '/' + selectedHeight : '';
    fetch('http://localhost:3000/images' + '/' + offset + '/' + to + filter)
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++ ) {
        let imageurl = data[i];
        let tokens = imageurl.split("/");
        if (tokens.length <= 2 )
          continue;
        let imagewidth = tokens[tokens.length - 2];
        let imageheight = tokens[tokens.length - 1];
        if (!widths.includes(imagewidth)) {
          widths.push(imagewidth);
        }
        if (!heights.includes(imageheight)) {
          heights.push(imageheight);
        }
        images.push({url:(imageurl + (grayScale?'?grayscale':'')), 
        originalWidth:imagewidth, 
        originalHeight:imageheight,
         width:300, height: 300 * imageheight/imagewidth });
      }
      setOffset(offset+data.length);
      if (data.length < 10)
        setHasMore(false);
    })
    .catch(error => setHasMore(false));
  }

  return (
    <div className="App">
      <header className="App-header">
        <label>GrayScale:<input type='checkbox' name='grayScale' checked={grayScale} onChange={onChange} /></label>
        <label> Width:
        <select name="width" onChange={onWidthChange} value={selectedWidth}>
            {widths.map((width) =>
                <option value={width}>{width == 0 ? '*': width}</option>
            )}
        </select>
        </label>
        <label> Height:
        <select name="height" onChange={onHeightChange} value={selectedHeight}>
            {heights.map((height) =>
                <option value={height}>{height == 0 ? '*': height}</option>
            )}
        </select>
        </label>
        <div className='container'>
          {showing && <Masonry className='masonry'
          hasMore={hasMore} loadMore={loadMore}>
            {
              images.map(({ url, originalWidth, originalHeight, width, height }, i) => (
                <div key={i} className='card' 
                  style={{ width:`${width}px`, height:`${height}px`}}>
                  <div>
                  <img src={url} width='300' alt={'Height:' + height + ' Width:=' + width}></img>
                  <div className="top-left">{'Original Dimension:' + originalWidth + ' x ' + originalHeight}</div>
                  </div>
                </div>                           
              ))
            }
          </Masonry>}
        </div>
      </header>
    </div>
  );
}

export default App;
