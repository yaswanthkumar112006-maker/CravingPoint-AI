package com.smartdelivery.smart_delivery_backend.service;

import com.smartdelivery.smart_delivery_backend.entity.CartItem;
import com.smartdelivery.smart_delivery_backend.entity.MenuItem;
import com.smartdelivery.smart_delivery_backend.entity.User;

import com.smartdelivery.smart_delivery_backend.repository.CartItemRepository;
import com.smartdelivery.smart_delivery_backend.repository.MenuItemRepository;
import com.smartdelivery.smart_delivery_backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    private final MenuItemRepository menuItemRepository;

    public CartItemService(
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            MenuItemRepository menuItemRepository
    ) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
    }

    // Add item to cart
    public CartItem addToCart(
            Long userId,
            Long menuItemId,
            CartItem cartItem
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Menu item not found"
                        )
                );

        CartItem existingCartItem =
                cartItemRepository
                        .findByUserIdAndMenuItemId(
                                userId,
                                menuItemId
                        );

        // If item already exists in cart
        if (existingCartItem != null) {

            existingCartItem.setQuantity(
                    existingCartItem.getQuantity()
                            + cartItem.getQuantity()
            );

            return cartItemRepository
                    .save(existingCartItem);
        }

        // Create new cart item
        cartItem.setUser(user);

        cartItem.setMenuItem(menuItem);

        return cartItemRepository.save(cartItem);
    }

    // Get user cart items
    public List<CartItem> getUserCartItems(
            Long userId
    ) {

        return cartItemRepository.findByUserId(userId);
    }

    // Delete cart item
    public void deleteCartItem(Long id) {

        cartItemRepository.deleteById(id);
    }

    // Update quantity
    public CartItem updateCartQuantity(
            Long cartItemId,
            Integer quantity
    ) {

        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart item not found"
                        )
                );

        cartItem.setQuantity(quantity);

        return cartItemRepository.save(cartItem);
    }
}