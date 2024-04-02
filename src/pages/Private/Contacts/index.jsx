import { Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ColorRing } from 'react-loader-spinner';

import styles from './styles.module.css';
import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';

export default function Contacts() {
	//data state um daten zu fetchen und nutzbar zu machen
	const [data, setData] = useState();
	const userData = useOutletContext();

	function sortData(data) {
		return data.sort(function (a, b) {
			if (a.fname.toLowerCase() > b.fname.toLowerCase()) return 1;
			if (a.fname.toLowerCase() < b.fname.toLowerCase()) return -1;
			return 0;
		});
	}

	useEffect(() => {
		//fetch alle userdaten vom backend
		const getAllUser = () => {
			fetch('http://localhost:5000/getAllUser', {
				method: 'GET',
			})
				.then((res) => res.json())
				.then((data) => {
					setData(sortData(data.data));
				});
		};
		getAllUser();

		return () => {};
	}, []);

	if (!data) {
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

	return (
		<>
			<title>Contacts</title>
			<header className={styles.headerContainer}>
				<h1>Contacts</h1>
				{userData.userType == 'Admin' && (
					<Link to="AddContact" className="btn btn-primary">
						Add Contact
						<Icon icon={ICONS.addContact} size="1.5rem" color="white" />
					</Link>
				)}
			</header>
			<div className={styles.contactContainer}>
				<ul>
					{data.map((entries, index, array) => {
						{
							return (
								<li key={entries._id} className={styles.listItem}>
									{(index == 0 ||
										(entries._id != userData._id &&
											entries.fname.toLowerCase().charAt(0) !=
												array[
													index - 1 == -1 ? array.length - 1 : index - 1
												].fname
													.toLowerCase()
													.charAt(0))) && (
										<>
											<p className={styles.contactOverhead}>
												{entries.fname.toUpperCase().charAt(0)}
											</p>
											<hr />
										</>
									)}
									{entries._id != userData._id && (
										<Link to={entries._id}>
											<div
												className={styles.avatar}
												style={{ backgroundColor: entries.color }}
											>
												{entries.fname.toUpperCase().charAt(0)}
												{entries.lname.toUpperCase().charAt(0)}
											</div>
											<div className={styles.info}>
												<p>
													{entries.fname} {entries.lname}
												</p>
												<p>{entries.email}</p>
											</div>
											<p className={styles.role}>{entries.userType}</p>
											{<p className={styles.phone}>{entries.phone}</p> || ' '}
											{entries.note && (
												<p className={styles.note}>{`"${entries.note}"`}</p>
											)}
										</Link>
									)}
								</li>
							);
						}
					})}
				</ul>
			</div>
		</>
	);
}
