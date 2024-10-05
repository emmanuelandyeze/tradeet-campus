import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	ScrollView,
	Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CheckoutScreen = () => {
	const [cartItems, setCartItems] = useState([]);
	const [currentTab, setCurrentTab] = useState(0);
	const totalAmount = cartItems.reduce(
		(acc, item) => acc + item.totalPrice,
		0,
	);

	// Fetch cart items from AsyncStorage
	useEffect(() => {
		const fetchCartItems = async () => {
			const storedCart = await AsyncStorage.getItem('cart');
			const parsedCart = storedCart
				? JSON.parse(storedCart)
				: [];
			setCartItems(parsedCart);
		};

		fetchCartItems();
	}, []);

	// Function to remove an item from the cart
	const handleRemoveItem = async (id) => {
		// Use id to filter out the specific item
		const updatedCart = cartItems.filter(
			(item) => item.id !== id,
		);
		setCartItems(updatedCart); // Update local state
		await AsyncStorage.setItem(
			'cart',
			JSON.stringify(updatedCart),
		); // Update AsyncStorage
	};

	const handleClearCart = async () => {
		Alert.alert(
			'Clear Cart',
			'Are you sure you want to clear the cart?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Yes',
					onPress: async () => {
						setCartItems([]);
						await AsyncStorage.setItem(
							'cart',
							JSON.stringify([]),
						);
					},
				},
			],
			{ cancelable: false },
		);
	};

	const renderOrderSummary = () => (
		<View style={styles.tabContent}>
			<FlatList
				data={cartItems}
				keyExtractor={(item) => item?.id?.toString()} // Ensure the key is a string
				renderItem={({ item }) => (
					<View style={styles.cartItem}>
						<Text style={styles.cartItemName}>
							{item.product} ({item.variant})
						</Text>
						<Text>Quantity: {item.quantity}</Text>
						{item.addOns.length > 0 && (
							<View>
								<Text style={styles.addOnsTitle}>
									Add-ons:
								</Text>
								{item.addOns.map((addOn, index) => (
									<Text key={index}>
										{addOn.name} (x{addOn.quantity})
									</Text>
								))}
							</View>
						)}
						<Text style={styles.cartItemPrice}>
							₦{item.totalPrice}
						</Text>
						<TouchableOpacity
							style={styles.removeButton}
							onPress={() => handleRemoveItem(item.id)} // Call remove item on press
						>
							<Text style={styles.removeButtonText}>
								Remove
							</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
			<Text style={styles.totalAmount}>
				Total: ₦{totalAmount}
			</Text>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => setCurrentTab(1)} // Switch to Delivery & Payment Summary
				>
					<Text style={styles.buttonText}>
						Make Payment
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.button, styles.clearCartButton]}
					onPress={handleClearCart}
				>
					<Text style={styles.buttonText}>Clear Cart</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderDeliveryAndPaymentSummary = () => (
		<View style={styles.tabContent}>
			<Text style={styles.summaryHeader}>
				Delivery Details
			</Text>
			<Text>Address: 123 Main St, Lagos</Text>
			<Text>Phone: 123-456-7890</Text>
			<Text style={styles.summaryHeader}>
				Payment Summary
			</Text>
			<Text>Total Amount: ₦{totalAmount}</Text>
			<TouchableOpacity
				style={styles.button}
				onPress={() =>
					console.log('Navigate to Payment Method')
				}
			>
				<Text style={styles.buttonText}>
					Proceed to Payment Method
				</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			<View style={styles.tabBar}>
				<TouchableOpacity
					style={[
						styles.tabButton,
						currentTab === 0 && styles.activeTab,
					]}
					onPress={() => setCurrentTab(0)}
				>
					<Text style={styles.tabButtonText}>
						Order Summary
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tabButton,
						currentTab === 1 && styles.activeTab,
					]}
					onPress={() => setCurrentTab(1)}
				>
					<Text style={styles.tabButtonText}>
						Delivery & Payment Summary
					</Text>
				</TouchableOpacity>
			</View>
			<ScrollView
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				style={styles.scrollContainer}
			>
				{currentTab === 0
					? renderOrderSummary()
					: renderDeliveryAndPaymentSummary()}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 16,
	},
	tabBar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	tabButton: {
		padding: 16,
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#007BFF',
	},
	tabButtonText: {
		fontSize: 16,
	},
	scrollContainer: {
		flex: 1,
	},
	tabContent: {
		width: width,
		padding: 16,
	},
	cartItem: {
		marginBottom: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		width: '90%',
	},
	cartItemName: {
		fontWeight: 'bold',
		fontSize: 18,
	},
	addOnsTitle: {
		fontWeight: 'bold',
	},
	cartItemPrice: {
		fontWeight: 'bold',
		color: '#007BFF',
	},
	totalAmount: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 16,
	},
	buttonContainer: {
		marginTop: 20,
	},
	button: {
		backgroundColor: '#007BFF',
		padding: 16,
		borderRadius: 8,
		marginTop: 20,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
	},
	clearCartButton: {
		backgroundColor: '#FF4D4D',
	},
	removeButton: {
		backgroundColor: '#FF4D4D',
		padding: 8,
		borderRadius: 4,
		marginTop: 10,
		alignItems: 'center',
	},
	removeButtonText: {
		color: '#fff',
	},
	summaryHeader: {
		fontWeight: 'bold',
		fontSize: 18,
		marginVertical: 10,
	},
});

export default CheckoutScreen;
