import { useEffect, useState } from "react";
import "./App.css";
import loadingImg from "./loading.svg";

const mainUrl = "https://workclass-api.herokuapp.com/api";

function App() {
  const [companyOptions, setCompanyOptions] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedPage, setSelectedPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  useEffect(() => {
    getCompanyList();
    getJobList();
  }, []);

  const getCompanyList = () => {
    setLoading(true);

    fetch(`${mainUrl}/company-list`)
      .then((res) => res.json())
      .then(
        (result) => {
          setLoading(false);
          setCompanyOptions(result);
        },
        (error) => {
          setLoading(false);
        }
      );
  };

  const getJobList = (urlParams) => {
    setLoading(true);

    fetch(`${mainUrl}/job-list${urlParams || ""}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setLoading(false);

          if (result.length > 0) {
            setJobList(selectedPage > 0 ? [...jobList, ...result] : result);
          }

          setNoMoreData(result.length === 0);
        },
        (error) => {
          setLoading(false);
        }
      );
  };

  const handleSearchJob = (companyName) => {
    const companyNameX = companyName === selectedCompanyName ? "" : companyName;
    setSelectedPage(0);
    setSelectedCompanyName(companyNameX);
    getJobList(`?companyName=${companyNameX}`);
  };

  const handleLoadMore = (page) => {
    setSelectedPage(page);
    getJobList(`?companyName=${selectedCompanyName}&page=${page}`);
  };

  return (
    <div className="App">
      <div className="header-title">Job Finder</div>

      <div className="company-options-container">
        {companyOptions.map((val, key) => (
          <div
            className={`option${
              selectedCompanyName === val.company_name ? " selected" : ""
            }`}
            key={key}
            onClick={() => handleSearchJob(val.company_name)}
          >
            {val.company_name}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-backdrop">
          <img src={loadingImg} />
        </div>
      ) : null}

      <div className="job-list-container">
        {jobList.map((val, key) => (
          <div key={key} className="job-container">
            <div
              className="img-container"
              style={{ backgroundImage: `url(${val.logo_url})` }}
            />
            <div className="detail-container">
              <div className="company-container">{val.company_name}</div>
              <div className="date-container">{val.date}</div>
              <div className="job-title-container">{val.job_title}</div>
            </div>
          </div>
        ))}
      </div>

      {noMoreData ? null : (
        <div
          className="load-more"
          onClick={() => handleLoadMore(selectedPage + 1)}
        >
          Load More
        </div>
      )}
    </div>
  );
}

export default App;
