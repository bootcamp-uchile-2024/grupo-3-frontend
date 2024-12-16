import React from 'react';
import { Card } from 'react-bootstrap';
import { User } from '../types/types'; 


interface CardUserProps {
  selectedUser: User;
}

const CardUser: React.FC<CardUserProps> = ({ selectedUser }) => {
  console.log('Selected User in Card:', selectedUser);

  return (
  <Card
    className="mb-4"
    style={{
      display: 'flex',
      width: '581px',
      height: '269px',
      padding: '35px 64px', 
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '10px',
      flexShrink: 0,
      borderRadius: '8px',
      background: '#DCE2D3',
      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      marginLeft: '57px', 
      marginBottom: '90px',
    }}
  >
    <Card.Body>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '41px',
        }}
      >
        {/* Imagen del usuario */}
        <div
          style={{
            width: '140px',
            height: '135px',
            borderRadius: '512px',
            background: `url("https://ui-avatars.com/api/?name=User+Name&background=1A4756&color=fff&size=128") lightgray 50% / cover no-repeat`,
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          }}
        ></div>

        {/* Texto del usuario */}
        <div>
          <Card.Title
            className="mb-2"
            style={{
              fontFamily: 'Quicksand',
              fontSize: '30px',
              fontWeight: 700,
              lineHeight: '52px',
              color: '#1A4756',
            }}
          >
            {`${selectedUser.nombre} ${selectedUser.apellido}`}
          </Card.Title>

          {/* Teléfono */}
          <div
            className="d-flex align-items-center gap-2"
            style={{
              fontFamily: 'Quicksand',
              fontSize: '20px',
              fontWeight: 400,
              lineHeight: '30px',
              color: '#1A4756',
              textAlign: 'center',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_3571_37347)">
                <path
                  d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
                  fill="#1A4756"
                />
              </g>
              <defs>
                <clipPath id="clip0_3571_37347">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {selectedUser.telefono}
          </div>

          {/* Email */}
          <div
            className="d-flex align-items-center gap-2 mt-2"
            style={{
              fontFamily: 'Quicksand',
              fontSize: '20px',
              fontWeight: 400,
              lineHeight: '30px',
              color: '#1A4756',
              textAlign: 'center',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_3571_37351)">
                <path
                  d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                  fill="#1A4756"
                />
              </g>
              <defs>
                <clipPath id="clip0_3571_37351">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {selectedUser.email}
          </div>

          {/* Tipo Usuario */}
          <div
            className="d-flex align-items-center gap-2 mt-2"
            style={{
              fontFamily: 'Quicksand',
              fontSize: '20px',
              fontWeight: 400,
              lineHeight: '30px',
              color: '#1A4756',
              textAlign: 'center',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_699_8277)">
                <path
                  d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"
                  fill="#1A4756"
                />
              </g>
              <defs>
                <clipPath id="clip0_699_8277">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {selectedUser.rol}
          </div>
        </div>
      </div>
    </Card.Body>
  </Card>
);
}
export default CardUser;


