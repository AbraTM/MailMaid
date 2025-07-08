import React from 'react';
import { useLocation } from 'react-router-dom';
import Loading from "../components/loading.jsx";
import GmailPNG from "../assets/gmail.png";
import "./finalize-details.css";

export default function FinalizeDetails() {
    const location = useLocation();
    const data = location.state.categories;
    const [totalEmails, setTotalEmails] = React.useState(0);
    const [deleting, setDeleting] = React.useState(false);
    const [done, setDone] = React.useState(false);

    const listElements = data.map((c, index) => {
        return (
            <li key={index}>
                {c.category}
                <span className='list-item-count'>({c.count})</span>
            </li>
        )
    })

    const handleDeletion = async(e) => {
        e.preventDefault();
        setDeleting(true);
        window.scrollBy({ top: 1000, behavior: "smooth"})
        try {
            const res = await fetch("http://localhost:5000/api/v1/emails/handle-deletion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categories: data.map((c) => c.category)
                }),
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Failed to delete emails on backend");
                setDeleting(false);
                return;
            }
            const resData = await res.json();
            console.log(resData)
            setDeleting(false);
            setDone(true);
        } catch (error) {
            console.error("Error while deleting emails:", error);
            setDeleting(false);
        }
    }
    
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    React.useEffect(() => {
        const total = data.reduce((sum, c) => sum + c.count, 0)
        setTotalEmails(total);
    }, [data])
    const doneRef = React.useRef(null);
    React.useEffect(() => {
        if(done && doneRef.current){
            doneRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [done])
    
    return (
        <div className='finalize-details'>
            <div className='finalize-details-content'>
                <div className="p-fd">
                    <h2>Finalize your details.</h2>
                    <div className='selected-categories-list-cn'>
                        <h4>Selected Categories.</h4>
                        <ul className='selected-categories-list'>
                            {listElements}
                        </ul>
                    </div>
                </div>
                <div className='o-del-btn'>
                    <h3>Ready to clean up your inbox?</h3>
                    <p>
                        Once you click <strong>Start Deletion</strong>, we will move the selected emails directly to your 
                        <strong> Trash</strong>. You can still review them there, and they will be permanently deleted automatically after 30 days.
                    </p>
                    <button type="button" className="get-started" onClick={handleDeletion}>
                        <span>Start Deletion</span>
                    </button>
                    <p className="final-warning">
                        <strong>Important:</strong> This action will begin moving your emails immediately. Please make sure your selections are correct before proceeding.
                    </p>
                </div>
            </div>
            {
                deleting 
                &&
                <div className='loading-cn'>
                    <h2>Cleaning up {totalEmails} emails...</h2>
                    <Loading size={120}/>
                </div>
            }
            { 
                done 
                &&
                <div className='deletion-success' ref={doneRef}>
                    <h2>Emails Moved Successfully! 🎉</h2>
                    <p>We’ve moved your selected emails to the <strong>Trash</strong> folder in your Gmail.</p>
                    <p>You can review them there and decide whether to permanently delete or restore them at any time. Emails in Trash will be automatically deleted after 30 days.</p>
                    <a 
                        className='gmail-btn go-to-gmail'
                        href="https://mail.google.com/mail/u/0/#trash" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <img src={GmailPNG} alt="Gmail icon" />
                        Go to your Gmail account
                    </a>
                </div>
            }
        </div>
    )
}