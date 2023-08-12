import React, { useState, useEffect, useRef } from 'react';
import type {
	HasPosition,
	KanbanCard,
	KanbanList,
	KanbanBoard
	} from './types'
import { ReactComponent as MenuIcon } from './icons/menu.svg';
import { ReactComponent as UserIcon } from './icons/user-icon.svg';
import './App.css';

const board: KanbanBoard = {
	name: 'Test',
	lists: [
		{
			name: 'Hello!',
			position: 0,
			cards: [
				{
					text: "what's up. if i add a bunch of text it will result in longer card, right? it must"
					, position: 0,
					id: 'cueo'
				}
			],
			id: 'x9rh'
		},
		{
			name: 'hola',
			position: 1,
			cards: [
				{
					text: "amigo",
					position: 0,
					id: 'qclh'
				},
				{
					text: "el gato",
					position: 1,
					id: '0p16'
				},
				{
					text: "las ninas estoy un poco loco",
					position: 2,
					id: 'z85y'
				}
			],
			id: 'niq4'
		},
		{
			name: 'Привет!',
			position: 0,
			cards: [
			],
			id: 've9l'
		}
	],
	id: 'vfr8'
}

type FocusableInputProps = React.ComponentPropsWithRef<"input"> & {
	setFocus: (state: boolean) => void;
	setInputText: (state: string) => void;
}

function FocusableInput(props: FocusableInputProps) {
	const setFocus = props.setFocus;
	const setInputText = props.setInputText;
 
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current === null) {
			throw Error(`FocusableInput inputRef.current is null`)
		}

		if (
			document.hasFocus() && inputRef.current.contains(document.activeElement)
		) {
			setFocus(true);
		}
	}, []);

	return (
		<input
			{...props}
			ref={inputRef}
			className={`${props.className} focusable-input`}
			onInput={ () => setInputText(inputRef.current!.value) }
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
		/>
	);
}

function Card({ card }: { card: KanbanCard }) {
	const [cardText, setCardText] = useState(card.text)
	const [hasFocus, setFocus] = useState(false);

	return (
		<li className={`card ${hasFocus ? 'has-focus' : ''}`} draggable>
			<FocusableInput
				className='card-text'
				value={cardText}
				setFocus={setFocus}
				setInputText={setCardText}
			/>
		</li>);
}


function MakeNewCardForm() {
	const [newCardText, setNewCardText] = useState('');
	const [hasFocus, setFocus] = useState(false);

	return (
		<form name='make-new-card'
			className={`make-new-card ${hasFocus ? 'has-focus' : ''}`} method='GET'>
			<FocusableInput 
				name="new-card-text"
				form='make-new-card'
				className="new-card-text"
				type="text"
				autoComplete="off"
				placeholder="Make new card"
				value={newCardText}
				setFocus={setFocus} 
				setInputText={setNewCardText}
			/>
			<input value="" className="new-card-submit" type='submit' />
		</form>);
}

function toSortedByPosition<T extends HasPosition>(iterable: T[]) {
	if (iterable.length === 0) {
		return [];
	}

	let sorted = [...iterable];
	return sorted.sort((el1, el2) => el1.position - el2.position);
}

type ListHeaderProps = {
	listName: string;
	setListName: (state: string) => void;
}

function ListHeader(props: ListHeaderProps) {
	const [hasFocus, setFocus] = useState(false);

	return (
		<div className="list-name-header">
			<FocusableInput
				className={`list-name ${hasFocus ? 'has-focus' : ''}`}
				type="text"
				value={props.listName}
				setFocus={setFocus}
				setInputText={props.setListName}
			/>
		</div>
	);
}

function List({ list }: { list: KanbanList }) {
	const [listName, setListName] = useState(list.name);
	return (
		<li className="list" draggable>
			<ListHeader 
				listName={listName}
				setListName={setListName}
			/>
			<ul className="list-cards-wrapper">
				{
					toSortedByPosition(list.cards).map(card =>
						<Card card={card} key={card.id}/>)
				}
			</ul>
			<MakeNewCardForm></MakeNewCardForm>
		</li>
	);
}

function getId() {
	return String(parseInt(String(Math.random() * 10000000)))
}

type MakeNewListsProps = {
	lists: KanbanList[];
	setLists: (state: KanbanList[]) => void;
}

function MakeNewList(props: MakeNewListsProps) {
	const emptyList: KanbanList = {
		name: '',
		position: props.lists.length + 1,
		cards: [],
		id: getId()
	}

	function handleClick() {
		props.setLists([...props.lists, emptyList])
	}

	return (
		<button 
			className='make-new-list'
			onClick={handleClick}
		>
			Make New List
		</button>
	);
}

function Board({ board }: { board: KanbanBoard }) {
	const [lists, setLists] = useState( board.lists );

	return (
		<div className='board'>
			<ul className="board-section">
				{
					toSortedByPosition(lists).map(list => <List list={list} key={list.id}/>)
				}
				<MakeNewList
					lists={lists}
					setLists={setLists}
				/>
			</ul>
		</div>
	);
}

type MenuItemProps = {
	name: string;
	icon: React.FunctionComponent;
}

function MenuItem(props: MenuItemProps) {
	function itemImage(icon: MenuItemProps["icon"]) {
		const IconComponent = icon;
		return <IconComponent />;
	}


	return (
		<li className='menu-item'>
			<button className="menu-item-icon">
				{itemImage(props.icon)}
			</button>
		</li>
	);
}

function Menu(props: React.ComponentPropsWithoutRef<'ul'>) {
	return (
		<ul className='menu'>
			{props.children}
		</ul>
	);
}

function Calendar() {
	return <div className='calendar'> <p>calendar section will be here stay tuned</p></div>
}

function App() {
	return (
		<>
			<Menu>
				<MenuItem name="menu" icon={MenuIcon}></MenuItem>
				<MenuItem name="user-icon" icon={UserIcon}></MenuItem>
			</Menu>
			<Board board={board} />
			<Calendar />
		</>);
}

export default App;
