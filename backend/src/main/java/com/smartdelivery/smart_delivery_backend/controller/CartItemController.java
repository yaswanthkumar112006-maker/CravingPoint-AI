package com.smartdelivery.smart_delivery_backend.controller;

import com.smartdelivery.smart_delivery_backend.entity.CartItem;

import com.smartdelivery.smart_delivery_backend.service.CartItemService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(
            CartItemService cartItemService
    ) {
        this.cartItemService = cartItemService;
    }
    @PutMapping("/{cartItemId}/{quantity}")
    public CartItem updateCartQuantity(
            @PathVariable Long cartItemId,
            @PathVariable Integer quantity
    ) {

        return cartItemService.updateCartQuantity(
                cartItemId,
                quantity
        );
    }
    // Add item to cart
    @PostMapping("/{userId}/{menuItemId}")
    public CartItem addToCart(
            @PathVariable Long userId,
            @PathVariable Long menuItemId,
            @RequestBody CartItem cartItem
    ) {

        return cartItemService.addToCart(
                userId,
                menuItemId,
                cartItem
        );
    }

    // Get user cart items
    @GetMapping("/{userId}")
    public List<CartItem> getUserCartItems(
            @PathVariable Long userId
    ) {

        return cartItemService
                .getUserCartItems(userId);
    }

    // Delete cart item
    @DeleteMapping("/{id}")
    public String deleteCartItem(
            @PathVariable Long id
    ) {

        cartItemService.deleteCartItem(id);

        return "Cart item deleted successfully";
    }
}