
import { AppRouter } from '../routes/AppRoutes'

export const App = () => {
    return (
        <div
            className="App"
            style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 15px',
            }}
        >
            <AppRouter />

        </div>
    )
}
