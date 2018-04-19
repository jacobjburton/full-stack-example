import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUser } from './../../ducks/users';

class Private extends Component
{
    componentDidMount()
    {
        this.props.getUser();
    }

    bankBalance()
    {
        return '$' + Math.floor((Math.random()+1) * 1000) + '.00';
    }

    render()
    {
        let {display_name, img, auth_id} = this.props.user
        return (
            <div>
               <h2>Community Bank</h2>
               <hr />
               <h4>Account Info:</h4>

                {
                    display_name ? 
                    (
                        <div>
                            <img src={img} alt="me"/>
                            <br />
                            <p>Account Holder:
                            {display_name}</p>
                            <p>Account Number: {auth_id}</p>    
                            <p>Account Balance: {this.bankBalance()}</p>  
                            <a href="http://localhost:3004/logout">
                                <button>Logout</button>
                            </a>                      
                        </div>
                    ) :
                    (
                        <p>Please Log In</p>
                    )
                }


            </div>
        )
    }
}

function mapStateToProps(state)
{
    return (
    {
        user: state.user
    });
    
}


export default connect(mapStateToProps, { getUser })(Private);