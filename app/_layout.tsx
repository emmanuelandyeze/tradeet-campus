import { Slot, Stack } from 'expo-router';
import { View, Text } from 'react-native';

// Import your global CSS file
import "../global.css"

export default function Layout() {
	return (
		<View style={{ flex: 1 }}>
			<Slot />
		</View>
	);
}
