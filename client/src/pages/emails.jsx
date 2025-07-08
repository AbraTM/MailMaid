import React from 'react';
import Loading from '../components/loading';
import ClassifiedEmails from './classified-emails';
import "./emails.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Emails() {
    const [emailQueryFrom, setEmailQueryForm] = React.useState({
      date: new Date().toISOString().split('T')[0],
      emailCount: 100
    });
    const [loading, setLoading] = React.useState(false);
    const [done, setDone] = React.useState(false);
    const [previewData, setPreviewData] = React.useState([]);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEmailQueryForm((prev) => {
        return {
          ...prev,
          [name] : value
        }
      })
    };

    const handleSubmit = async(e) => {
      e.preventDefault();
      setLoading(true);
      window.scrollBy({ top: 200, behavior: "smooth" });
      const res = await fetch(`${BACKEND_URL}/api/v1/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailQueryFrom),
        credentials: "include"
      })
      const data = await res.json();
      setPreviewData(() => {
        const classifiedArray = Object.entries(data).map(([category, categoryData]) => {
          return {
            category,
            ...categoryData
          }
        })
        
        return classifiedArray;
      });
      setLoading(false);
      setDone(true);
    }

    const previewDataRef = React.useRef(null);
    React.useEffect(() => {
      if (previewData.length > 0) {
        previewDataRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [previewData]);

    return (
      <div className='emails'>
        <form className='email-query-form'>
            <div className='o-date-input'>
              <label htmlFor="date">Select a date before which you want us to clear your emails from.</label>
              <br/>
              <input type='date' id='date' className='date-input' name='date' value={emailQueryFrom.date} onChange={handleChange}/>
            </div>
            
            <div className='g-count-input'>
              <label htmlFor='email-count'>Select the no. of emails before the date provided you want us to check.</label>
              <br/>
              <input type='number' id='emailCount' min="0" max="500" className='count-input' name='emailCount' value={emailQueryFrom.emailCount} onChange={handleChange}/>
            </div>

            <div className='b-submit-btn'>
                <label>Submit.</label>
                <br/>
                <button type='submit' className='get-emails-btn' onClick={handleSubmit}><span>Get Emails</span></button>
            </div>
        </form>

        <div className='preview-data' ref={previewDataRef}>
            {
              loading 
              &&
              <Loading />
            }
            {
              done
              &&
              <div className='emails-preview'>
                <div className='y-preview-head'>
                  <h3>You're emails preview.</h3>
                  <h4>Select the categories you want to get rid off.</h4>
                </div>
                <ClassifiedEmails data={previewData} />
              </div>
            }
        </div>
        
      </div>
    )
}
