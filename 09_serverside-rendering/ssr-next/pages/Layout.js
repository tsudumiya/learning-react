import Header from './Header.js';

export default function Layout(props) {
    return (
        <div>
            <Header />
            {props.children}
        </div>
    );
}
