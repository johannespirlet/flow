import { useEffect, useState } from 'react';
import { ColorRing } from 'react-loader-spinner';
import { Outlet } from 'react-router-dom';

export default function UserDetails({ handleLogout }) {
	const [userData, setUserData] = useState('');

	useEffect(() => {
		fetch('http://localhost:5000/getUser', {
			method: 'POST',
			crossDomain: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				token: window.localStorage.getItem('token'),
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.data == 'token abgelaufen') {
					handleLogout();
				} else {
					setUserData(data.data);
				}
			});
	});

	if (!userData) {
		return (
			<ColorRing
				visible={true}
				height="80"
				width="80"
				ariaLabel="color-ring-loading"
				wrapperStyle={{
					position: 'relative',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
				}}
				wrapperClass={`color-ring-wrapper`}
				colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
			/>
		);
	}

	return <Outlet context={userData} />;
}
