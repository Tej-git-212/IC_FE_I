import React , { useState , useEffect , useRef , useCallback } from 'react';
import axios from 'axios';

const Image_body = () => {

    const [ items , setItems ] = useState([]);
    const [ loading , setLoading ] = useState(true);
    const [ start , setStart ] = useState(0);
    const [ hasMore , setHasMore ] = useState(true);

    const observer = useRef();

    const lastBlockRef = useCallback(node =>{
        if(loading) return;
        if(observer.current) 
           observer.current.disconnect();
        observer.current =  new IntersectionObserver( entries => {
            if(entries[0].isIntersecting && hasMore){
                setStart(start=>start+1);
            }
        })
        if(node) observer.current.observe(node);
    },[loading]);

    useEffect(()=>{
        setLoading(true);
        const fetchItems = async ()=>{

            const result = await axios({
              method:'GET',
              url : 'https://jsonplaceholder.typicode.com/photos',
              params : { _start:start , _limit:10 }
            });
            setHasMore(result.data.length>0);
            setItems(result.data);
            setLoading(false);
        }
        fetchItems();
    },[start]);

    return (
        <div className="container">
           <div>
             {items.map((item,index)=>(
                (items.length===index+1)? 
                  <div ref = {lastBlockRef}  className="item" key= {item.id}>
                          <h3>{item.title}</h3>
                          <img src={item.url} style={{ width:'300px' , height:'300px' }}/>
                  </div> :
                  <div className="item" key= {item.id}>
                     <h3>{item.title}</h3>
                     <img src={item.url} style={{ width:'300px' , height:'300px' }}/>
                  </div>
             ))}
           </div> 
           {loading ? <h2>Loading...</h2> : null}
        </div>
    )
}

export default Image_body