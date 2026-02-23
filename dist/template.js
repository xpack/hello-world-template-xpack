import assert from 'node:assert';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as util from 'node:util';
import { fileURLToPath } from 'node:url';
import gitConfigPath from 'git-config-path';
import parseGitConfig from 'parse-git-config';
import * as xpmLib from '@xpack/xpm-lib';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const propertiesDefinitions = {
    language: {
        label: 'Programming language',
        description: 'Select the preferred programming language',
        type: 'select',
        items: {
            c: 'C for the application files',
            cpp: 'C++ for the application files',
        },
        default: 'cpp',
        isMandatory: true,
    },
    buildGenerator: {
        label: 'Build System',
        description: 'Select the tool to generate the builds',
        type: 'select',
        items: {
            cmake: 'The CMake build system',
            meson: 'The Meson build system',
            autotools: 'Autotools configure & GNU make (legacy)',
        },
        default: 'cmake',
    },
    toolchain: {
        label: 'Toolchain',
        description: 'Select the toolchain to be used by the builds',
        type: 'select',
        items: {
            gcc: {
                platforms: ['linux', 'win32'],
                message: 'The xPack GNU Compiler Collection (GCC) toolchain',
            },
            clang: 'The xPack LLVM clang toolchain',
            system: {
                platforms: ['linux', 'darwin'],
                message: 'The system toolchain',
            },
        },
        default: 'clang',
    },
};
export class XpmInitTemplate extends xpmLib.InitTemplateBase {
    constructor({ context, policies }) {
        super({
            context,
            templatesPath: path.resolve(__dirname, '..', 'templates', 'sources'),
            __dirname: path.dirname(__dirname),
            policies,
            propertiesDefinitions,
        });
    }
    async generate() {
        const log = this.log;
        const context = this.context;
        const config = context.config;
        const moduleFolderPath = this.__dirname;
        const substitutionsVariables = this.substitutionsVariables;
        assert(substitutionsVariables, 'Substitutions variables not initialised');
        const configPath = gitConfigPath('global');
        const gitConfig = (configPath ? parseGitConfig.sync({ path: configPath }) : {});
        gitConfig.user ??= {};
        log.trace(util.inspect(gitConfig));
        const author = {
            name: gitConfig.user.name ?? 'my name',
            email: gitConfig.user.email ?? 'my@eMail.com',
            url: gitConfig.user.email === 'ilg@livius.net'
                ? 'https://github.com/ilg-ul'
                : 'https://my-url',
        };
        substitutionsVariables.author = author;
        const githubId = gitConfig.user.email === 'ilg@livius.net' ? 'ilg-ul' : 'my-github-id';
        substitutionsVariables.githubId = githubId;
        const packageJsonPath = path.resolve(moduleFolderPath, 'package.json');
        const jsonContent = await fs.readFile(packageJsonPath);
        const jsonPackage = JSON.parse(jsonContent.toString());
        substitutionsVariables.package = jsonPackage;
        const matrix = substitutionsVariables.matrix;
        const fileExtension = matrix.language;
        substitutionsVariables.fileExtension = fileExtension;
        const lang = matrix.language === 'cpp' ? 'C++' : 'C';
        log.info(`Creating the ${lang} project ` +
            `'${substitutionsVariables.projectName}'...`);
        if (!this.isInteractive) {
            Object.entries(this.propertiesDefinitions).forEach(([key, val]) => {
                if (!val.isMandatory) {
                    log.info(`- ${key}=${String(substitutionsVariables[key])}`);
                }
            });
            log.info();
        }
        log.debug(`from='${this.templatesPath}'`);
        log.trace(util.inspect(substitutionsVariables));
        await fs.mkdir(config.cwd, { recursive: true });
        await this.render({
            sourceFilePath: 'include/hello-world-liquid.h',
            destinationFilePath: 'include/hello-world.h',
        });
        await this.render({
            sourceFilePath: `src/hello-world-liquid.${fileExtension}`,
            destinationFilePath: `src/hello-world.${fileExtension}`,
        });
        await this.render({
            sourceFilePath: 'libs/adder/include/add/add-liquid.h',
            destinationFilePath: 'libs/adder/include/add/add.h',
        });
        await this.render({
            sourceFilePath: 'libs/adder/src/add-liquid.c',
            destinationFilePath: 'libs/adder/src/add.c',
        });
        if (matrix.buildGenerator === 'cmake') {
            await this.render({
                sourceFilePath: 'cmake/toolchains/clang-liquid.cmake',
                destinationFilePath: 'cmake/toolchains/clang.cmake',
            });
            await this.render({
                sourceFilePath: 'cmake/toolchains/gcc-liquid.cmake',
                destinationFilePath: 'cmake/toolchains/gcc.cmake',
            });
            await this.render({
                sourceFilePath: 'CMakeLists-liquid.txt',
                destinationFilePath: 'CMakeLists.txt',
            });
        }
        else if (matrix.buildGenerator === 'meson') {
            await this.render({
                sourceFilePath: 'meson-liquid.build',
                destinationFilePath: 'meson.build',
            });
            await this.copyFolder({
                sourceFolderRelativePath: 'meson',
                destinationFolderPath: 'meson',
            });
            await this.render({
                sourceFilePath: 'libs/meson-liquid.build',
                destinationFilePath: 'libs/meson.build',
            });
            await this.render({
                sourceFilePath: 'libs/adder/meson-liquid.build',
                destinationFilePath: 'libs/adder/meson.build',
            });
        }
        else {
            await this.copyFile({
                sourceFileRelativePath: 'autotools/configure',
                destinationFilePath: 'autotools/configure',
            });
            await this.copyFile({
                sourceFileRelativePath: 'autotools/make-template/libs/adder/src/folder.mk',
                destinationFilePath: 'autotools/make-template/libs/adder/src/folder.mk',
            });
            await this.render({
                sourceFilePath: 'autotools/make-template/src/folder-liquid.mk',
                destinationFilePath: 'autotools/make-template/src/folder.mk',
            });
            await this.render({
                sourceFilePath: 'autotools/make-template/makefile-liquid',
                destinationFilePath: 'autotools/make-template/makefile',
            });
            await this.copyFile({
                sourceFileRelativePath: 'a.vscode/c_cpp_properties-autotools.json',
                destinationFilePath: '.vscode/c_cpp_properties.json',
            });
        }
        await this.copyFile({
            sourceFileRelativePath: 'a.vscode/tasks.json',
            destinationFilePath: '.vscode/tasks.json',
        });
        await this.copyFile({
            sourceFileRelativePath: 'a.vscode/settings.json',
            destinationFilePath: '.vscode/settings.json',
        });
        await this.copyFile({
            sourceFileRelativePath: 'a.gitignore',
            destinationFilePath: '.gitignore',
        });
        await this.copyFile({
            sourceFileRelativePath: 'a.npmignore',
            destinationFilePath: '.npmignore',
        });
        await this.render({
            sourceFilePath: 'README-liquid.md',
            destinationFilePath: 'README.md',
        });
        await this.render({
            sourceFilePath: 'LICENSE-liquid',
            destinationFilePath: 'LICENSE',
        });
        await this.render({
            sourceFilePath: 'package-liquid.json',
            destinationFilePath: 'package.json',
        });
    }
}
//# sourceMappingURL=template.js.map