--Query 1: Inserting a new account
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Query 2: Updating account type
UPDATE public.account
SET account_type = 'admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Query 3: Deleting an account
DELETE FROM public.account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Query 4: Updating inventory description
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Query 5: Selecting inventory
SELECT inv_make,
    inv_model
FROM public.inventory
    INNER JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';
-- Query 6: Updating inventory images for all items
UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/'),
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/');