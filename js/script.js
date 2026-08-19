document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =========================================
       FORMAT RUPIAH
    ========================================= */

    const rupiah = (number) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(number);

    };


    /* =========================================
       ELEMENT
    ========================================= */

    const products =
        [...document.querySelectorAll(".product")];

    const cartButton =
        document.getElementById("cartButton");

    const cartPanel =
        document.getElementById("cartPanel");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const cartClose =
        document.getElementById("cartClose");

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartSubtotal =
        document.getElementById("cartSubtotal");

    const cartShipping =
        document.getElementById("cartShipping");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutButton =
        document.getElementById("checkoutButton");


    /* MOBILE */

    const burger =
        document.getElementById("burger");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const mobileOverlay =
        document.getElementById("mobileOverlay");

    const mobileClose =
        document.getElementById("mobileClose");

    const mobileSearch =
        document.getElementById("mobileSearch");

    const mobileSearchButton =
        document.getElementById("mobileSearchButton");


    /* SEARCH */

    const productSearch =
        document.getElementById("productSearch");

    const clearSearch =
        document.getElementById("clearSearch");


    /* =========================================
       SETTING
    ========================================= */

    const WHATSAPP =
        "6281234567890";

    const DELIVERY =
        10000;


    /* =========================================
       CART
    ========================================= */

    const cart = {};


    /* =========================================
       OPEN CART
    ========================================= */

    function openCart() {

        if (!cartPanel || !cartOverlay) return;

        cartPanel.classList.add("open");

        cartOverlay.classList.add("show");

    }


    /* =========================================
       CLOSE CART
    ========================================= */

    function closeCartPanel() {

        if (!cartPanel || !cartOverlay) return;

        cartPanel.classList.remove("open");

        cartOverlay.classList.remove("show");

    }


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    if (cartClose) {

        cartClose.addEventListener(
            "click",
            closeCartPanel
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCartPanel
        );

    }


    /* =========================================
       RENDER CART
    ========================================= */

    function renderCart() {

        if (!cartItems) return;


        const items =
            Object.values(cart);


        const count =
            items.reduce(
                (total, item) =>
                    total + item.qty,
                0
            );


        const subtotal =
            items.reduce(
                (total, item) =>
                    total +
                    item.price *
                    item.qty,
                0
            );


        const shipping =
            subtotal > 0
                ? DELIVERY
                : 0;


        const total =
            subtotal +
            shipping;


        if (cartCount) {

            cartCount.textContent =
                count;

        }


        if (cartSubtotal) {

            cartSubtotal.textContent =
                rupiah(subtotal);

        }


        if (cartShipping) {

            cartShipping.textContent =
                rupiah(shipping);

        }


        if (cartTotal) {

            cartTotal.textContent =
                rupiah(total);

        }


        /* KERANJANG KOSONG */

        if (!items.length) {

            cartItems.innerHTML = `
                <p class="empty">
                    Keranjang masih kosong.
                </p>
            `;

            return;

        }


        /* ISI KERANJANG */

        cartItems.innerHTML =
            items.map(item => {

                return `
                    <div class="cart-line">

                        <div>

                            <strong>
                                ${item.name}
                            </strong>

                            <br>

                            <small>
                                ${item.qty} ×
                                ${rupiah(item.price)}
                            </small>

                        </div>

                        <button
                            type="button"
                            class="remove"
                            data-name="${item.name}"
                            style="
                                border:0;
                                background:transparent;
                                color:#c33;
                            "
                        >
                            Hapus
                        </button>

                    </div>
                `;

            }).join("");


        /* REMOVE */

        cartItems
            .querySelectorAll(".remove")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const name =
                            button.dataset.name;

                        delete cart[name];

                        renderCart();

                    }
                );

            });

    }


    /* =========================================
       ADD PRODUCT
    ========================================= */

    products.forEach(product => {

        const addButton =
            product.querySelector(".add");


        if (!addButton) return;


        addButton.addEventListener(
            "click",
            () => {

                const name =
                    product.dataset.name;


                const price =
                    Number(
                        product.dataset.price
                    );


                if (!name || !price) {

                    console.error(
                        "Data produk tidak lengkap:",
                        product
                    );

                    return;

                }


                if (!cart[name]) {

                    cart[name] = {

                        name: name,

                        price: price,

                        qty: 0

                    };

                }


                cart[name].qty++;


                renderCart();


                openCart();

            }
        );

    });


    /* =========================================
       FILTER PRODUCT
    ========================================= */

    const filterButtons =
        document.querySelectorAll(
            ".filter"
        );


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                products.forEach(product => {

                    const category =
                        product.dataset.category;


                    if (
                        filter === "all" ||
                        category === filter
                    ) {

                        product.classList.remove(
                            "hidden"
                        );

                    } else {

                        product.classList.add(
                            "hidden"
                        );

                    }

                });

            }
        );

    });


    /* =========================================
       CATEGORY CARD
    ========================================= */

    document
        .querySelectorAll(".category-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const filter =
                        card.dataset.categoryLink;


                    if (!filter) return;


                    filterButtons.forEach(
                        button => {

                            button.classList.toggle(
                                "active",
                                button.dataset.filter ===
                                filter
                            );

                        }
                    );


                    products.forEach(product => {

                        product.classList.toggle(
                            "hidden",
                            product.dataset.category !==
                            filter
                        );

                    });

                }
            );

        });


    /* =========================================
       SEARCH
    ========================================= */

    function searchProducts(value) {

        const query =
            value
                .trim()
                .toLowerCase();


        products.forEach(product => {

            const name =
                (
                    product.dataset.name ||
                    ""
                ).toLowerCase();


            if (
                !query ||
                name.includes(query)
            ) {

                product.classList.remove(
                    "hidden"
                );

            } else {

                product.classList.add(
                    "hidden"
                );

            }

        });

    }


    /* DESKTOP SEARCH */

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            () => {

                searchProducts(
                    productSearch.value
                );

            }
        );

    }


    /* CLEAR SEARCH */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                if (productSearch) {

                    productSearch.value = "";

                    searchProducts("");

                    productSearch.focus();

                }

            }
        );

    }


    /* MOBILE SEARCH */

    if (mobileSearchButton) {

        mobileSearchButton.addEventListener(
            "click",
            () => {

                searchProducts(
                    mobileSearch
                        ? mobileSearch.value
                        : ""
                );

                closeMobile();

            }
        );

    }


    if (mobileSearch) {

        mobileSearch.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    searchProducts(
                        mobileSearch.value
                    );

                    closeMobile();

                }

            }
        );

    }


    /* =========================================
       MOBILE MENU
    ========================================= */

    function openMobile() {

        if (!mobileMenu ||
            !mobileOverlay) return;


        mobileMenu.classList.add(
            "open"
        );


        mobileOverlay.classList.add(
            "show"
        );


        document.body.style.overflow =
            "hidden";


        if (burger) {

            burger.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function closeMobile() {

        if (!mobileMenu ||
            !mobileOverlay) return;


        mobileMenu.classList.remove(
            "open"
        );


        mobileOverlay.classList.remove(
            "show"
        );


        document.body.style.overflow =
            "";


        if (burger) {

            burger.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    if (burger) {

        burger.addEventListener(
            "click",
            openMobile
        );

    }


    if (mobileClose) {

        mobileClose.addEventListener(
            "click",
            closeMobile
        );

    }


    if (mobileOverlay) {

        mobileOverlay.addEventListener(
            "click",
            closeMobile
        );

    }


    if (mobileMenu) {

        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMobile
                );

            });

    }


    /* =========================================
       CHECKOUT WHATSAPP
    ========================================= */

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {

                const items =
                    Object.values(cart);


                if (!items.length) {

                    alert(
                        "Keranjang masih kosong."
                    );

                    return;

                }


                const subtotal =
                    items.reduce(
                        (total, item) =>
                            total +
                            item.price *
                            item.qty,
                        0
                    );


                const shipping =
                    DELIVERY;


                const total =
                    subtotal +
                    shipping;


                const productMessage =
                    items
                        .map(item =>
                            `• ${item.name} x${item.qty} = ${rupiah(item.price * item.qty)}`
                        )
                        .join("\n");


                const message =
`Halo SegarMart 👋

Saya ingin memesan:

${productMessage}

Subtotal: ${rupiah(subtotal)}
Ongkir: ${rupiah(shipping)}
Total: ${rupiah(total)}

Mohon dikonfirmasi.

Terima kasih.`;


                const whatsappURL =
                    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;


                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }


    /* =========================================
       FOOTER YEAR
    ========================================= */

    const year =
        document.getElementById("year");


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =========================================
       INITIAL CART
    ========================================= */

    renderCart();


    console.log(
        "SegarMart berhasil dijalankan."
    );

});