const fs = require('fs');
const path = require('path');

let create_advancement = (dir, write_dir, file_name, namespace, overwrite) => {
    console.log(`reading ${dir}/${file_name}`);
    let recipe_json = JSON.parse(fs.readFileSync(`${dir}/${file_name}`).toString());
    let items = [];

    switch (recipe_json.type) {
        case "minecraft:crafting_shaped":
            for (key of Object.keys(recipe_json.key)) {
                items.push(recipe_json.key[key]);
            }
            break;
        case "minecraft:crafting_shapeless":
            items = recipe_json.ingredients;
            break;
    }

    console.log(items);

    let json = `{
	"parent": "minecraft:recipes/root",
	"rewards": {
		"recipes": [
			"${namespace}:${file_name}"
		]
	},
	"criteria": {
		"has_ingredients": {
			"trigger": "minecraft:inventory_changed",
			"conditions": {
				"items": [
					${items.map((i) => JSON.stringify(i)).join(",\n\t\t\t\t\t")}
				]
			}
		},
		"has_the_recipe": {
			"trigger": "minecraft:recipe_unlocked",
			"conditions": {
				"recipe": "${namespace}:${file_name}"
			}
		}
	},
	"requirements": [
		[
			"has_ingredients",
			"has_the_recipe"
		]
	]
}`;

    if (!fs.existsSync(path.dirname(`${write_dir}/${file_name}`)))
        fs.mkdirSync(path.dirname(`${write_dir}/${file_name}`), { recursive: true });

    if (!fs.existsSync(`${write_dir}/${file_name}`) || overwrite)
        fs.writeFileSync(`${write_dir}/${file_name}`, json);
}


let recursive_read = (dir_name) => {
    let items = [];

    for (file of fs.readdirSync(dir_name)) {
        if (fs.lstatSync(`${dir_name}/${file}`).isDirectory()) {
            let file_clone = file;
            let sub_dir = recursive_read(`${dir_name}/${file}`);
            for (sub_file of sub_dir) {
                items.push(`${file_clone}/${sub_file}`)
            }
        } else {
            items.push(file)
        }
    }

    return items;
}

console.log(recursive_read('./Survival Tweaks/data/survivaltweaks/recipes'));
for (file of recursive_read('./Survival Tweaks/data/survivaltweaks/recipes'))
    create_advancement('./Survival Tweaks/data/survivaltweaks/recipes', './Survival Tweaks/data/survivaltweaks/advancements/recipes', file, 'survivaltweaks', process.argv[2] == "true");

console.log(recursive_read('./Vanilla Expert Mode/data/expert_mode/recipes'));
for (file of recursive_read('./Vanilla Expert Mode/data/expert_mode/recipes'))
    create_advancement('./Vanilla Expert Mode/data/expert_mode/recipes', './Vanilla Expert Mode/data/expert_mode/advancements/recipes', file, 'expert_mode', process.argv[2] == "true");