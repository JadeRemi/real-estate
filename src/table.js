
import React, { useState, useEffect }  from "react";



const availableApis = [
  {name: "homes", apikey: "https://603e38c548171b0017b2ecf7.mockapi.io/homes", key: "1"},
]
const labelColoring = [
  {name: 'IndependentLiving', colorclass: 'label__independent', labeltext: 'Independent Living'},
  {name: 'SupportAvailable', colorclass: 'label__support', labeltext: 'Restaurant & Support Available'}
]


const Table = () => {
  const [loading, setLoading] = useState(true);
  const [homeList, setHomeList] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);


  useEffect(async () => {
    retrieveContents.apply(this);
  }, []);

  useEffect(async () => {
    if (search.length) {
      let userFilter = [];
      homeList.map( (x, i) => {
        if (x.title.toLowerCase().includes(search)) {
          userFilter.push(i);
        }
        setFilter(userFilter);
      });
    }
  }, [search]);

  //useEffect(async () => {
  //}, [filter]);

  async function contactApi(){
    let address = availableApis[0].apikey
    await fetch(address)
    .then(data => data.json())
    .then(data => {
      setHomeList(data);
    });
  };

  async function retrieveContents(){
    if (loading) {
      await contactApi()
      .then (() => {
        setLoading(false);
      });
    }
  }


  function renderLine() {
    let results = [];
    let searcherror = 
    <div className="empty__search">
      <p>Нет результатов</p>
    </div>
    
    homeList.map((x, i) => {
      if (search.length < 3 || filter.includes(i)) {
        let labeltype = labelColoring.find(y => y.name == x.type)
        let labeltext = labeltype ? labeltype.labeltext : x.type;
        let labelclass = labeltype ? labeltype.colorclass : "label__support";
        let labelid = x.id ? x.id : 0;
        let cellContents = 
        <a className="searchContents__item" id={'id'+x.id} href={"/details/" + labelid}>
          <div className="imgwrapper">
            <img alt={x.title} src={"https://via.placeholder.com/300x150/9ebb69/343d37?text="+x.title} className="item__img"/> 
            <div className={"imgwrapper__label " + labelclass}>{labeltext}</div>
          </div>


          <p className="item__text item__name">{x.title}</p>
          <p className="item__text">{x.address}</p>
          <p className="item__text">New Properties for Sale from <strong className="boldtext">£{x.price}</strong></p>
          <p className="item__text">Shared ownership available</p>
        </a>;
        results.push(cellContents);
      }
      return results;
    });
    if (results.length == 0) {results = searcherror;}
    return (
      <React.Fragment>
        {results}
      </React.Fragment>
      );
  }





  return (
    <React.Fragment>
      {loading ? <div className="preloader">Загрузка</div> :
      <div className="contentwrapper">
        
        <form id="filter" className="filter">
          <label htmlFor="fname" className="filter__text">Filter</label>
          <input type="text" id="fname" name="fname" className="filter__input" placeholder="enter your filter" onChange={e => setSearch(e.target.value.toLowerCase())}/>
        </form>

        <div className="searchContents">
          {renderLine()}
        </div>

        <a className="seemore" href="#">
          <p>See more ›</p>
        </a>
      </div>
      } 
    </React.Fragment>
  );
};

export default Table;