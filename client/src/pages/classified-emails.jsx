import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./classified-emails.css";

export default function ClassifiedEmails(props) {
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [categoryError, setCategoryError] = React.useState("");

    const handleCategorySelection = (event) => {
        setSelectedCategories((prev) => {
            const { name, checked } = event.target;
            const selectedCategory = props.data.find(c => c.category === name);
            if(checked){
                if(!prev.find(c => c.category === name)){
                    return [
                        ...prev,
                        {
                            category: name,
                            count: selectedCategory.count
                        }
                    ]
                }
            }else{
                return prev.filter((c) => c.category !== name);
            }
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(selectedCategories.length === 0){
            setCategoryError("Please select at least one category to continue.")
            return;
        }
        setCategoryError("");
        navigate("/finalize-details", {
            state: {
                categories: selectedCategories
            }
        });
    }

    const [expandedCategories, setExpandedCategories] = React.useState({});
    const handleToggle = (index) => {
        setExpandedCategories((prev) => {
            return {
                ...prev,
                [index] : !prev[index]
            }
        })
    }

    const decodeHTMLEntities = (str) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(str, "text/html");
        return doc.documentElement.textContent;
    }

    const categoryElements = props.data.map((category, index) => {
        const showCount = expandedCategories[index] ? 3 : 1;
        return(
            <div className='category' key={index}>
                <div className='category-head-l1'>
                    <div className='category-head-text'>
                        <h4>{category.category}</h4>
                        <p>Count : {category.count}</p>
                        <h6>Examples : </h6>
                    </div>
                    <input type='checkbox' className='custom-checkbox' name={category.category} onClick={handleCategorySelection}/>
                </div>
                
                
                <div className="emails-cn">
                    {category.examples && category.examples.slice(0, showCount).map((email, index) => {
                        return(
                            <div className="email" key={index}>
                                <h5>{email.name}</h5>
                                <div className='email-info'>
                                    <span>{email.senderEmail}</span>
                                    <span>{email.date.split("+")[0].trim()}</span>
                                </div>
                                <div className='email-sub'>{decodeHTMLEntities(email.subject)}</div>
                                <div className='email-sum'><span>Summary : </span>{decodeHTMLEntities(email.summary)}</div>
                            </div>
                        )
                    })}
                </div>

                {/* Handle toggle 'see more' and 'see less' */}
                {
                    category.examples && category.examples.length > 1 && (
                        <button type="button" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleToggle(index)
                        }} className='expand-btn'>
                            {expandedCategories[index] ? "Show Less" : "Show More"}
                        </button>
                    )
                }
            </div>
        )
    })
    return (
        <form className='categories-cn'>
            {categoryElements}
            <div className='p-submit-choices'>
                <h3>Confirm your selected email categories.</h3>
                <p>These emails won't be permanently deleted right away. Instead, we'll move them to your <strong>Trash</strong> in Gmail. You can review them there and decide whether to permanently delete them or move them back to your inbox if we misclassified something. Emails in Trash will be automatically deleted after 30 days.</p>
                <button type='submit' className='get-started submit-choices-btn' onClick={handleSubmit}>
                    <span>Submit Choices</span>
                </button>
                {categoryError && <span className='category-error'>{categoryError}</span>}
                <p><strong>Important:</strong> Once you click, we will immediately begin moving these emails. Please make sure your selections are correct before proceeding.</p>
            </div>
        </form>
    )
}
